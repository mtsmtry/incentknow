module Incentknow.Pages.Notifications where

import Prelude

import Data.Array (filter, length)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getNotifications, readAllNotifications)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeCommand, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (iconSolid, remoteArrayWith, remoteWith, userIcon)
import Incentknow.Atoms.Message (commentBox)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedComment, IntactNotification, NotificationAction(..), NotificationType(..), RelatedComment, RelatedContent)
import Incentknow.Data.EntityUtils (getNotificationType)
import Incentknow.HTML.DateTime (elapsedTime)
import Incentknow.HTML.Utils (css, link, maybeElem, whenElem)
import Incentknow.Route (Route(..), UserTab(..))
import Incentknow.Templates.Main (centerLayout)
import Incentknow.Templates.Page (verticalTabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = {}

type State
  = { notifications :: Remote (Array IntactNotification), tab :: Tab }

data Action
  = Initialize
  | HandleInput Input
  | FetchedNotifications (Fetch (Array IntactNotification))
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | ChangeTab Tab

data Tab
  = All
  | Comments
  | Replies

derive instance eqTab :: Eq Tab

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
initialState input = { notifications: Loading, tab: All }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout { css: "", leftSide: [], rightSide: [] }
    [ verticalTabPage "page-notifications"
        { tabs: [ All, Comments, Replies ]
        , currentTab: state.tab
        , onChangeTab: ChangeTab
        , showTab:
            case _ of
              All -> [ HH.text "All", countElement $ map notReadCount state.notifications ]
              Comments -> [ HH.text "Comments", countElement $ map notReadCount notificationComments ]
              Replies -> [ HH.text "Replies", countElement $ map notReadCount notificationReplies ]
        }
        [ iconSolid "bell"
        , HH.text "Notifications"
        ]
        [ renderNotifications
            case state.tab of 
              All -> state.notifications
              Comments -> notificationComments
              Replies -> notificationReplies
        ]
    ]
  where
  notificationComments = map (filter $ \x-> (getNotificationType x.action) == NotificationTypeContentCommented) state.notifications
  notificationReplies = map (filter $ \x-> (getNotificationType x.action) == NotificationTypeCommentReplied) state.notifications
  notReadCount x = length $ filter (not <<< _.isRead) x
  
  countElement :: Remote Int -> H.ComponentHTML Action ChildSlots m
  countElement remote =
    maybeElem (toMaybe remote) \x->
      whenElem (x > 0) \_->
        HH.span [ css "count" ] [ HH.text $ "(" <> show x <> ")" ]

  renderNotifications :: Remote (Array IntactNotification) -> H.ComponentHTML Action ChildSlots m
  renderNotifications remote =
    remoteArrayWith remote \notifications->
      HH.div [ css "notifications" ] (map renderNotification notifications)

  renderNotification :: IntactNotification -> H.ComponentHTML Action ChildSlots m
  renderNotification notification = 
    HH.div [ css $ "notification" <> if notification.isRead then "" else " not-read" ] 
      ( case notification.action of
          ContentCommentedNotificationAction content comment ->
            [ HH.div [ css "top" ] 
                [ renderContentTitle content
                , HH.text "にコメントがつきました"
                ]
            , renderComment comment
            ]
          CommentRepliedNotificationAction content comment ->
            [ HH.div [ css "top" ] 
                [ renderContentTitle content
                , HH.text "でコメントに返信がきました"
                ]
            , renderComment comment
            ]
      )

  renderContentTitle :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContentTitle content = 
    link NavigateRoute (Content content.contentId)
      [ css "content" ]
      [ HH.text (getContentSemanticData content.data content.format).title ]

  renderComment :: RelatedComment -> H.ComponentHTML Action ChildSlots m
  renderComment comment = 
    HH.div [ css "comment" ]
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

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedNotifications $ getNotifications unit
  HandleInput _ -> handleAction Initialize
  FetchedNotifications fetch -> do
    forRemote fetch \notifications ->
      H.modify_ _ { notifications = notifications }
    _ <- executeCommand $ readAllNotifications unit
    pure unit
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route
  ChangeTab tab -> H.modify_ _ { tab = tab }