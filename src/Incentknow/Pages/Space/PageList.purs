module Incentknow.Pages.Space.PageList where

import Prelude

import Ace.Document (getAllLines)
import Data.Array (filter, length)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Api (Format, Space, getFormats)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Ids (CommunityId(..), SpaceId(..))
import Incentknow.Data.Page (ContentComposition)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.CardView (CardViewItem)
import Incentknow.Organisms.CardView as CardView
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..))

type Input
  = { spaceId :: SpaceId }

type State
  = { spaceId :: SpaceId, formats :: Remote (Array Format) }

data Action
  = Initialize
  | Navigate Route
  | FetchedFormats (Fetch (Array Format))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( cardview :: CardView.Slot Unit )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, formats: Loading }

toCardViewItem :: State -> Format -> CardViewItem
toCardViewItem state format =
  { title: format.displayName 
  , route: Composition state.spaceId format.formatId ""
  , desc: ""
  , info: ""
  }

render :: forall m. MonadEffect m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-page-list" ]
    [ HH.div [ css "table" ]
        [ HH.div [ css "header" ]
            [ HH.div [ css "column" ]
                [ --HH.text "ã‚¹ãƒšãƒ¼ã‚¹"
                ]
            ]
        , HH.div [ css "body" ]
            [ remoteWith state.formats \formats->
                HH.slot (SProxy :: SProxy "cardview") unit CardView.component { items: map (toCardViewItem state) $ filter (\x-> length x.collectionPage.compositions > 0) formats } absurd
            ]
        ]
    ]


handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedFormats $ getFormats state.spaceId
  FetchedFormats fetch -> do
    forFetch fetch \formats->
      H.modify_ _ { formats = formats }
  Navigate route -> navigate route
