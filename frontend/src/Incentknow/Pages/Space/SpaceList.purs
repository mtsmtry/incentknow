module Incentknow.Pages.SpaceList where

import Prelude

import Data.Array (length)
import Data.Maybe (Maybe(..), isNothing, maybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getMySpaces, getPublishedSpaces)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Entities (FocusedSpace)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Organisms.SpaceCardView as SpaceCardView
import Incentknow.Route (Route(..))
import Incentknow.Templates.Main (centerLayout)

type Input
  = {}

type State
  = { publishedSpaces :: Remote (Array FocusedSpace)
    , followedSpaces :: Remote (Array FocusedSpace)
    , logined :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
  | FetchedPublishedSpaces (Fetch (Array FocusedSpace))
  | FetchedFollowedSpaces (Fetch (Array FocusedSpace))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( cardview :: SpaceCardView.Slot Unit
    , cardview2 :: SpaceCardView.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval 
        { initialize = Just Initialize
        , handleAction = handleAction
        , receive = Just <<< HandleInput }
    }

initialState :: Input -> State
initialState input = { publishedSpaces: Loading, followedSpaces: Loading, logined: true }

render :: forall m. MonadEffect m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout { leftSide: [], rightSide: [] }
    [ HH.div [ css "page-spaces" ]
      [ whenElem state.logined \_ ->
          HH.div [ css "part" ]
            [ HH.div [ css "caption" ]
                [ HH.text "My spaces"
                , HH.span [ css "count" ] [ HH.text $ maybe "" (\x-> "(" <> show (length x) <> ")") $ toMaybe state.followedSpaces ]
                , HH.span [ css "creation" ] [
                    -- submitButton { isDisabled: false, isLoading: false, loadingText: "", onClick: Navigate NewSpace, text: "スペースを作成" }
                    menuPositiveButton "スペースを作成" $ Navigate NewSpace
                  ]
                ]
            , remoteWith state.followedSpaces \spaces ->
                HH.slot (SProxy :: SProxy "cardview") unit SpaceCardView.component { value: spaces } absurd
            ]
      , HH.div [ css "part" ]
          [ HH.div [ css "caption" ]
              [ HH.text $ "Public spaces"
              , HH.span [ css "count" ] [ HH.text $ maybe "" (\x-> "(" <> show (length x) <> ")") $ toMaybe state.publishedSpaces ]
              ]
          , remoteWith state.publishedSpaces \spaces ->
              HH.slot (SProxy :: SProxy "cardview2") unit SpaceCardView.component { value: spaces } absurd
          ]
      ]
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedPublishedSpaces getPublishedSpaces
    callbackQuery FetchedFollowedSpaces getMySpaces
  HandleInput _ -> do
    handleAction Initialize
  FetchedPublishedSpaces fetch ->
    forRemote fetch \spaces ->
      H.modify_ _ { publishedSpaces = spaces }
  FetchedFollowedSpaces fetch ->
    forRemote fetch \spaces -> do
      H.modify_ _ { followedSpaces = spaces }
      when (isNothing $ toMaybe spaces) do
        H.modify_ _ { logined = false }
  Navigate route -> navigate route
