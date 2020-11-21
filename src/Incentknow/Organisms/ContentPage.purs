module Incentknow.Organisms.ContentPage where

import Prelude

import Data.Array (catMaybes, concat, filter, length, mapWithIndex, range)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (allJust, flatten)
import Data.Newtype (unwrap, wrap)
import Data.Nullable (toMaybe, toNullable)
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for, for_)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, checkbox, pulldown, textarea)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Page (ContentPage, ContentRelation)
import Incentknow.Data.Property (Enumerator, Property, PropertyInfo, Type(..), getTypeName)
import Incentknow.Data.Utils (generateId)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.PropertyMenu as PropertyMenu
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.Enumeration as Enumeration

type Input
  = { readonly :: Boolean
    , spaceId :: SpaceId
    , formatId :: FormatId
    }

type State
  = { readonly :: Boolean
    , relations :: Array PendingContentRelation
    , spaceId :: SpaceId
    , formatId :: FormatId
    }

data Action
  = ChangeFormatId Int (Maybe FormatId)
  | ChangeDisplayName Int String
  | ChangeProperty Int (Maybe String)
  | AddRelation
  | DeleteRelation Int
  | HandleInput Input

data Query a
  = GetValue (ContentPage -> a)
  | SetValue ContentPage a

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Int
    , propMenu :: PropertyMenu.Slot Int
    , delete :: DangerChange.Slot Int
    )

component :: forall o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML Query Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , handleQuery = handleQuery
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = { readonly: input.readonly, relations: [], spaceId: input.spaceId, formatId: input.formatId }

type PendingContentRelation
  = { formatId :: Maybe FormatId
    , displayName :: Maybe String
    , property :: Maybe String
    }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-structure" ]
    [ if not state.readonly then
        HH.div
          [ css "buttons-area" ]
          [ button "追加" AddRelation ]
      else
        HH.text ""
    , HH.table_
        [ HH.thead
            []
            [ HH.tr []
                [ whenElem (not state.readonly) \_ ->
                    HH.th [] [ HH.text "" ]
                , HH.th [] [ HH.text "表示名" ]
                , HH.th [] [ HH.text "フォーマット" ]
                , HH.th [] [ HH.text "プロパティ" ]
                ]
            ]
        , HH.tbody
            []
            (mapWithIndex relation state.relations)
        ]
    ]
  where
  relation :: Int -> PendingContentRelation -> H.ComponentHTML Action ChildSlots m
  relation index rel =
    HH.tr
      []
      [ whenElem (not state.readonly) \_ ->
          HH.td []
            [ HH.slot (SProxy :: SProxy "delete") index DangerChange.component
                { text: "削除"
                , title: "リレーションの削除"
                , message: "リレーション「" <> fromMaybe (show index) rel.displayName <> "」" <> "を本当に削除しますか？"
                }
                (\_ -> Just $ DeleteRelation index)
            ]
      , HH.td []
          [ if state.readonly then
              HH.text $ fromMaybe "" rel.displayName
            else
              textarea
                { value: fromMaybe "" rel.displayName
                , placeholder: ""
                , onChange: ChangeDisplayName index
                }
          ]
      , HH.td []
          [ HH.slot (SProxy :: SProxy "formatMenu") index FormatMenu.component
              { value: rel.formatId, filter: FormatMenu.SpaceBy state.spaceId, disabled: state.readonly }
              (Just <<< ChangeFormatId index)
          ]
      , HH.td []
          [ maybeElem rel.formatId \formatId ->
              HH.slot (SProxy :: SProxy "propMenu") index PropertyMenu.component
                { value: rel.property, formatId, type: Just $ ContentType { format: state.formatId }, disabled: state.readonly }
                (Just <<< ChangeProperty index)
          ]
      ]

toMaybeString :: String -> Maybe String
toMaybeString x = if x == "" then Nothing else Just x

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  ChangeDisplayName index displayName -> do
    H.modify_ (\x -> x { relations = modifyRel index (_ { displayName = toMaybeString displayName }) x.relations })
  ChangeFormatId index formatId -> do
    H.modify_ (\x -> x { relations = modifyRel index (_ { formatId = formatId }) x.relations })
  ChangeProperty index property -> do
    H.modify_ (\x -> x { relations = modifyRel index (_ { property = property }) x.relations })
  AddRelation -> do
    H.modify_ (\x -> x { relations = x.relations <> [ { displayName: Nothing, formatId: Nothing, property: Nothing } ] })
  DeleteRelation index -> do
    H.modify_ \x -> x { relations = catMaybes $ mapWithIndex (\index2 -> \y -> if index == index2 then Nothing else Just y) x.relations }
  HandleInput input -> H.modify_ _ { readonly = input.readonly }
  where
  modifyRel :: Int -> (PendingContentRelation -> PendingContentRelation) -> Array PendingContentRelation -> Array PendingContentRelation
  modifyRel index modify = mapWithIndex (\index2 -> \x -> if index == index2 then modify x else x)

toContentRelation :: PendingContentRelation -> Maybe ContentRelation
toContentRelation rel = do
  displayName <- rel.displayName
  formatId <- rel.formatId
  property <- rel.property
  pure
    { displayName
    , formatId
    , property
    }

handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    let
      rels = map toContentRelation state.relations
    pure $ map k $ map (\x -> { relations: x }) $ allJust $ rels
  SetValue value k -> do
    let
      relations = map convert value.relations
    H.modify_ _ { relations = relations }
    pure $ Just k
    where
    convert :: ContentRelation -> PendingContentRelation
    convert rel =
      { displayName: Just rel.displayName
      , formatId: Just rel.formatId
      , property: Just rel.property
      }
