module Incentknow.Pages.Composition.Timeline where

import Prelude
import Data.Array (sortBy)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.HalogenM (SubscriptionId(..))
import Incentknow.Api (Content, getContents, onSnapshotContents)
import Incentknow.Api.Execution (executeApi, subscribeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Pages.Content as Content
import Incentknow.Route (ContentSpec(..))

type Input
  = { spaceId :: SpaceId, formatId :: FormatId }

type State
  = { spaceId :: SpaceId
    , formatId :: FormatId
    , contents :: Array Content
    , subId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeContents (Array Content)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot ContentId )

component :: forall q o m. MonadAff m => Behaviour m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, formatId: input.formatId, contents: [], subId: Nothing }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state = HH.div [ css "page-cmp-timeline" ] (map renderItem state.contents)
  where
  renderItem :: Content -> H.ComponentHTML Action ChildSlots m
  renderItem content =
    HH.div [ css "item" ]
      [ HH.slot (SProxy :: SProxy "content") content.contentId Content.component { contentSpec: ContentSpecContentId content.contentId } absurd
      ]

handleAction :: forall o m. MonadAff m => Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.subId \subId ->
      H.unsubscribe subId
    subId <- subscribeApi ChangeContents $ onSnapshotContents { spaceId: state.spaceId, formatId: state.formatId }
    H.modify_ _ { subId = Just subId }
  ChangeContents contents -> H.modify_ _ { contents = sortBy compareContent contents }
    where
    compareContent a b = compare b.createdAt a.createdAt
  HandleInput input -> pure unit
