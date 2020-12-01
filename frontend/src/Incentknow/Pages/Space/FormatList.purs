module Incentknow.Pages.Space.FormatList where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Api (getFormats)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (RelatedFormat)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Route (FormatTab(..), Route(..))

type Input
  = { spaceId :: SpaceId }

type State
  = { spaceId :: SpaceId, formats :: Remote (Array RelatedFormat) }

data Action
  = Initialize
  | Navigate Route
  | FetchedFormats (Fetch (Array RelatedFormat))

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, formats: Loading }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.div [ css "page-format-list" ]
    [ submitButton { isDisabled: false , isLoading: false , loadingText: "" , onClick: Navigate $ NewFormat state.spaceId, text: "新しいフォーマットを作成する" }
    , HH.div [ css "table" ]
        [ HH.div [ css "header" ]
            [ HH.div [ css "column" ]
                [ HH.text "フォーマット"
                ]
            ]
        , remoteWith state.formats \formats-> 
            HH.div [ css "body" ]
                (map renderItem formats)
        ]
    ]
  where
  renderItem :: RelatedFormat -> H.ComponentHTML Action () m
  renderItem format =
    HH.div [ css "item" ]
      [ HH.div [ css "name", HE.onClick $ \_ -> Just $ Navigate $ Format format.formatId FormatMain ] [ HH.text format.displayName ]
      , HH.div [ css "desc" ] [ HH.text format.description ]
      ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedFormats $ getFormats state.spaceId
  FetchedFormats fetch -> do
    forFetch fetch \formats->
      H.modify_ _ { formats = formats }
  Navigate route -> navigate route
