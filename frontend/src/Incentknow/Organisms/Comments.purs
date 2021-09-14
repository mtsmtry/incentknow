module Incentknow.Organisms.Comments where

import Prelude

import Data.Array (foldr, length)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isJust, isNothing)
import Data.String as S
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.API (commentContent, replyToComment)
import Incentknow.API.Execution (Remote, executeCommand)
import Incentknow.AppM (class Behaviour, getAccount, navigate, navigateRoute)
import Incentknow.Atoms.Icon (iconSolid, remoteWith, userIcon)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (commentBox)
import Incentknow.Data.Entities (FocusedComment, FocusedTreeComment, IntactAccount)
import Incentknow.Data.Ids (CommentId, ContentId)
import Incentknow.HTML.DateTime (elapsedTime)
import Incentknow.HTML.Utils (css, link, maybeElem, whenElem)
import Incentknow.Molecules.MultilineTextarea as MultilineTextarea
import Incentknow.Route (Route(..), UserTab(..))
import Test.Unit.Console (consoleLog)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Remote (Array FocusedTreeComment)
    , contentId :: Maybe ContentId
    }

type State
  = { comments :: Remote (Array FocusedTreeComment)
    , newComment :: String
    , submittingComment :: Boolean
    , contentId :: Maybe ContentId
    , account :: Maybe IntactAccount
    , replyTo :: Maybe CommentId
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | EditComment String
  | SubmitComment
  | ChangeReplyTo (Maybe CommentId)
  | CancelComment

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( textarea :: MultilineTextarea.Slot Unit )

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { comments: input.value
  , newComment: ""
  , submittingComment: false
  , contentId: input.contentId
  , account: Nothing
  , replyTo: Nothing
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-comments" ]
    [ HH.div [ css "top" ]
        [ HH.text "Comments"
        , HH.span [ css "count" ]
            [ remoteWith state.comments \comments->
                HH.text $ " (" <> show (foldr (+) 0 $ map (\x-> length x.replies + 1) comments) <> ")"
            ]
        ]
    , remoteWith state.comments \comments->
        HH.div [ css "comments" ] $
          [ whenElem (isNothing state.replyTo) \_->
              maybeElem state.account renderNewComment
          ] <> (map renderTreeCommnet comments)
    ]
  where
  renderNewComment :: IntactAccount -> H.ComponentHTML Action ChildSlots m
  renderNewComment account = 
    HH.div [ css "org-comments-comment" ]
      [ HH.div [ css "usericon" ] 
          [ userIcon account.iconImage ]
      , commentBox "new-comment-body"
          [ HH.div [ css "top" ] 
              [ HH.div [ css "header" ] 
                  [ HH.text $ if isNothing state.replyTo then "新しいコメント" else "新しい返信" ]
                  , whenElem (isJust state.replyTo) \_->
                      HH.div [ css "cancel", HE.onClick $ \_-> Just CancelComment ]
                        [ iconSolid "times"
                  ]
              ]
          , HH.div [ css "body" ]
              [ HH.div [ css "left" ]
                  [ HH.div [ css "text" ] 
                      [ HH.slot (SProxy :: SProxy "textarea") unit MultilineTextarea.component
                          { value: state.newComment }
                          (Just <<< EditComment)
                      ]
                  ]
              , HH.div [ css "right" ] 
                  [ submitButton
                      { text: "追加"
                      , loadingText: "追加中"
                      , isDisabled: S.length state.newComment == 0
                      , isLoading: state.submittingComment
                      , onClick: SubmitComment
                      }
                  ]
              ]
          ]
      ]

  renderTreeCommnet :: FocusedTreeComment -> H.ComponentHTML Action ChildSlots m
  renderTreeCommnet comment =
    HH.div [ css "comment" ]
      [ HH.div [ css "org-comments-comment" ]
          [ link NavigateRoute (User comment.user.displayId UserMain)
              [ css "usericon" ] 
              [ userIcon comment.user.iconImage ]
          , commentBox "comment-body"
              [ HH.div [ css "top" ]
                  [ link NavigateRoute (User comment.user.displayId UserMain)
                      [ css "username" ]
                      [ HH.text comment.user.displayName ]
                  , HH.div [ css "time" ] 
                      ( if comment.createdAt == comment.updatedAt then 
                          [ elapsedTime comment.createdAt ]
                        else
                          [ elapsedTime comment.updatedAt, HH.text "に編集" ]
                      )
                  , HH.div [ css "reply", HE.onClick $ \_-> Just $ ChangeReplyTo $ Just comment.commentId ]
                      [ HH.text "返信" ]
                  ]
              , HH.div [ css "text" ] [ HH.text comment.text ]
              ]
          ]
      , HH.div [ css "replies" ] $
          (map renderReplyCommnet comment.replies)
          <> [ 
            whenElem (state.replyTo == Just comment.commentId) \_->
              maybeElem state.account renderNewComment
          ]
      ]

  renderReplyCommnet :: FocusedComment -> H.ComponentHTML Action ChildSlots m
  renderReplyCommnet comment =
    HH.div [ css "org-comments-comment" ]
      [ link NavigateRoute (User comment.user.displayId UserMain)
          [ css "usericon" ] 
          [ userIcon comment.user.iconImage ]
      , commentBox "comment-body"
          [ HH.div [ css "top" ]
              [ link NavigateRoute (User comment.user.displayId UserMain)
                  [ css "username" ]
                  [ HH.text comment.user.displayName ]
              , HH.div [ css "time" ] 
                  ( if comment.createdAt == comment.updatedAt then 
                      [ elapsedTime comment.createdAt ]
                    else
                      [ elapsedTime comment.updatedAt, HH.text "に編集" ]
                  )
              ]
          , HH.div [ css "text" ] [ HH.text comment.text ]
          ]
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    account <- getAccount
    H.modify_ _ { account = account }
  HandleInput input -> H.modify_ _ { comments = input.value, contentId = input.contentId }
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route
  EditComment text -> H.modify_ _ { newComment = text }
  SubmitComment -> do
    state <- H.get
    for_ state.contentId \contentId-> do
      H.modify_ _ { submittingComment = true }
      case state.replyTo of
        Nothing -> do
          result <- executeCommand $ commentContent contentId state.newComment
          case result of
            Just comment -> H.modify_ \x-> x { submittingComment = false, newComment = "", comments = map (\y-> [comment] <> y) x.comments }
            Nothing -> H.modify_ _ { submittingComment = false }
        Just replyTo -> do
          result <- executeCommand $ replyToComment replyTo state.newComment
          case result of
            Just comment -> 
              H.modify_ \x-> x 
                { submittingComment = false
                , replyTo = Nothing
                , newComment = ""
                , comments = map (map \y-> if y.commentId == replyTo then y { replies = y.replies <> [comment] } else y) x.comments
                }
            Nothing -> H.modify_ _ { submittingComment = false }
  ChangeReplyTo replyTo -> H.modify_ _ { replyTo = replyTo }
  CancelComment -> H.modify_ _ { replyTo = Nothing, newComment = "" }