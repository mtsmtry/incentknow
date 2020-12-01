module Incentknow.Pages.Composition where

import Prelude
import Data.Array (index, length, range)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Content, Space, Format, getContents, getFormat)
import Incentknow.Api.Utils (executeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Page (ContentComposition(..), toContentComposition)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Organisms.ContentList as ContentList
import Incentknow.Pages.Composition.Outliner as Outliner
import Incentknow.Pages.Composition.Timeline as Timeline
import Incentknow.Templates.Page (tabPage)

type Input
  = { formatId :: FormatId, spaceId :: SpaceId, tab :: String }

type State
  = { formatId :: FormatId
    , spaceId :: SpaceId
    , format :: Maybe Format
    , compotisions :: Array ContentComposition
    , tab :: Int
    }

data Action
  = Initialize
  | ChangeTab Int

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( outliner :: Outliner.Slot Unit
    , timeline :: Timeline.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { formatId: input.formatId
  , spaceId: input.spaceId
  , format: Nothing
  , compotisions: []
  , tab: 0
  }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  maybeElem state.format \format ->
    tabPage
      { tabs: range 0 (length state.compotisions - 1)
      , currentTab: state.tab
      , onChangeTab: ChangeTab
      , showTab:
          \tab -> case index state.compotisions tab of
            Just (CompositionOutliner _) -> "Outliner"
            Just (CompositionBoard) -> "Borad"
            Just (CompositionGallery) -> "Gallery"
            Just (CompositionTimeline) -> "Timeline"
            Just (CompositionList) -> "List"
            Just (CompositionTable) -> "Table"
            Nothing -> "エラー"
      }
      []
      [ HH.div [ css "page-space" ]
          [ HH.div [ css "name" ] [ HH.text format.displayName ]
          -- , HH.div [ css "desc" ] [ HH.text x.description ]
          ]
      ]
      [ case index state.compotisions state.tab of
          Just (CompositionOutliner outliner) -> HH.slot (SProxy :: SProxy "outliner") unit Outliner.component { spaceId: state.spaceId, formatId: state.formatId, outliner } absurd
          Just (CompositionTimeline) -> HH.slot (SProxy :: SProxy "timeline") unit Timeline.component { spaceId: state.spaceId, formatId: state.formatId } absurd
          _ -> HH.text ""
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    pure unit
    --result <- executeApi $ getFormat state.formatId
    --for_ result \format ->
    --  H.modify_ _ { format = Just format, compotisions = map toContentComposition format.collectionPage.compositions }
  ChangeTab tab -> H.modify_ _ { tab = tab }
