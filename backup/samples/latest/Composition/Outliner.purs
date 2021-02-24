module Incentknow.Pages.Composition.Outliner where

import Prelude
import Control.Parallel (sequential)
import Data.Argonaut.Core (toObject, toString)
import Data.Array (catMaybes, filter, foldr, fromFoldable, head, length)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.Nullable (Nullable, toMaybe)
import Data.Set (Set)
import Data.Set as S
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Foreign.Object (lookup)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Content, getContents, onSnapshotContents)
import Incentknow.Api.Execution (executeApi, subscribeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SpaceId(..))
import Incentknow.Data.Page (Outliner)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Pages.Content as Content
import Incentknow.Route (ContentSpec(..))

type Input
  = { spaceId :: SpaceId
    , formatId :: FormatId
    , outliner :: Outliner
    }

type Item
  = { content :: Maybe Content
    , children :: Set ContentId
    , parent :: Maybe ContentId
    }

type State
  = { spaceId :: SpaceId
    , formatId :: FormatId
    , outliner :: Outliner
    , items :: Map ContentId Item
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeContents (Maybe String) (Array Content)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot ContentId )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { spaceId: input.spaceId
  , formatId: input.formatId
  , outliner: input.outliner
  , items: M.empty
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-cmp-outliner" ]
    (map renderItem $ filter (\x -> isNothing x.parent) $ fromFoldable $ M.values state.items)
  where
  renderItem :: Item -> H.ComponentHTML Action ChildSlots m
  renderItem item =
    maybeElem item.content \content ->
      HH.div [ css "page-cmp-outliner_item" ]
        [ HH.slot (SProxy :: SProxy "content") content.contentId Content.component { contentSpec: ContentSpecContentId content.contentId } absurd
        , whenElem (length childItems > 0) \_ ->
            HH.div [ css "children" ] (map renderItem childItems)
        ]
    where
    childItems = catMaybes $ map (\contentId -> M.lookup contentId state.items) $ fromFoldable item.children

initialItem :: Item
initialItem =
  { content: Nothing
  , children: S.empty
  , parent: Nothing
  }

setContent :: Maybe String -> Content -> Map ContentId Item -> Map ContentId Item
setContent maybeParentProp content items = case maybeParentId of
  Just parentId -> M.alter setChildren parentId addedItems
  Nothing -> addedItems
  where
  addedItems = M.alter (\x -> Just (fromMaybe initialItem x) { parent = maybeParentId, content = Just content }) content.contentId items

  setChildren = case _ of
    Just item -> Just item { children = S.insert content.contentId item.children }
    Nothing -> Just initialItem { children = S.singleton content.contentId }

  maybeParentId = do
    parentProp <- maybeParentProp
    obj <- toObject content.data
    propJson <- lookup parentProp obj
    prop <- toString propJson
    pure $ ContentId prop

insertRoot :: FormatId -> Map FormatId String -> Map FormatId (Maybe String)
insertRoot formatId props = M.alter (maybe (Just Nothing) Just) formatId $ map Just props

handleAction :: forall o m. MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    let
      parentProps = insertRoot state.formatId state.outliner.parentProperties

      formatIds = M.keys parentProps
    for_ formatIds \formatId -> do
      let
        parentProp = flatten $ M.lookup formatId parentProps
      subscribeApi (ChangeContents parentProp) $ onSnapshotContents { formatId, spaceId: state.spaceId }
  HandleInput input -> pure unit
  ChangeContents parentProp contents -> do
    H.modify_ \x -> x { items = foldr (setContent parentProp) x.items contents }
