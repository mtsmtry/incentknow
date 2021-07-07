module Incentknow.Pages.SpaceList where

import Prelude

import Ace.Document (getAllLines)
import Data.Either (isLeft)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isNothing)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.API (getMySpaces, getPublishedSpaces)
import Incentknow.API.Execution (Fetch, Remote(..), callAPI, callbackQuery, executeAPI, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (RelatedSpace)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Organisms.CardView (CardViewItem)
import Incentknow.Organisms.CardView as CardView
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..))

type Input
  = {}

type State
  = { publishedSpaces :: Remote (Array RelatedSpace), followedSpaces :: Remote (Array RelatedSpace), logined :: Boolean }

data Action
  = Initialize
  | Navigate Route
  | FetchedPublishedSpaces (Fetch (Array RelatedSpace))
  | FetchedFollowedSpaces (Fetch (Array RelatedSpace))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( cardview :: CardView.Slot Unit
    , cardview2 :: CardView.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { publishedSpaces: Loading, followedSpaces: Loading, logined: true }

toCardViewItem :: RelatedSpace -> CardViewItem
toCardViewItem space =
  { title: space.displayName
  , route: Space space.displayId SpacePages
  , desc: ""
  , info: "" --"コンテンツ数:" <> show space.contentCount
  }

render :: forall m. MonadEffect m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-spaces" ]
    [ submitButton { isDisabled: false, isLoading: false, loadingText: "", onClick: Navigate NewSpace, text: "新しいスペースを作成する" }
    , whenElem state.logined \_ ->
        HH.div [ css "part" ]
          [ HH.div [ css "caption" ]
              [ HH.text "登録しているスペース"
              ]
          , remoteWith state.followedSpaces \spaces ->
              HH.slot (SProxy :: SProxy "cardview") unit CardView.component { items: map toCardViewItem spaces } absurd
          ]
    , HH.div [ css "part" ]
        [ HH.div [ css "caption" ]
            [ HH.text "公開されているスペース"
            ]
        , remoteWith state.publishedSpaces \spaces ->
            HH.slot (SProxy :: SProxy "cardview2") unit CardView.component { items: map toCardViewItem spaces } absurd
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedPublishedSpaces getPublishedSpaces
    callbackQuery FetchedFollowedSpaces getMySpaces
  FetchedPublishedSpaces fetch ->
    forRemote fetch \spaces ->
      H.modify_ _ { publishedSpaces = spaces }
  FetchedFollowedSpaces fetch ->
    forRemote fetch \spaces -> do
      H.modify_ _ { followedSpaces = spaces }
      when (isNothing $ toMaybe spaces) do
        H.modify_ _ { logined = false }
  Navigate route -> navigate route
