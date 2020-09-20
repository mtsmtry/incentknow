module Incentknow.Organisms.CollectionPage where

import Prelude

import Data.Array (catMaybes, concat, filter, length, mapWithIndex, range)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (allJust, flatten)
import Data.Nullable (toMaybe, toNullable)
import Data.String as String
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, checkbox, pulldown)
import Incentknow.Data.Ids (FormatId(..))
import Incentknow.Data.Page (CollectionPage, ContentComposition, ContentPage, ContentRelation, fromContentComposition, toContentComposition)
import Incentknow.Data.Property (Enumerator, Property, PropertyInfo, Type(..), getTypeName)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.CompositionMenu as CompositionMenu
import Incentknow.Molecules.DangerChange as DangerChange

type Input
  = { readonly :: Boolean
    }

type State
  = { readonly :: Boolean
    , compositions :: Array PendingContentComposition
    }

data Action
  = ChangeComposition Int (Maybe ContentComposition)
  | AddComposition
  | DeleteComposition Int
  | HandleInput Input

data Query a
  = GetValue (CollectionPage -> a)
  | SetValue (CollectionPage) a

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( compositionMenu :: CompositionMenu.Slot Int
    , delete :: DangerChange.Slot Int
    )

type PendingContentComposition
  = { composition :: Maybe ContentComposition
    }

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
initialState input =
  { readonly: input.readonly
  , compositions: []
  }

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
          [ button "追加" AddComposition ]
      else
        HH.text ""
    , HH.table_
        [ HH.thead
            []
            [ HH.tr []
                [ whenElem (not state.readonly) \_->
                    HH.th [] [ HH.text "" ]
                , HH.th [] [ HH.text "コンポジション" ]
                ]
            ]
        , HH.tbody
            []
            (mapWithIndex composition state.compositions)
        ]
    ]
  where
  composition :: Int -> PendingContentComposition -> H.ComponentHTML Action ChildSlots m
  composition index comp =
    HH.tr
      []
      [ whenElem (not state.readonly) \_->
          HH.td []
            [ HH.slot (SProxy :: SProxy "delete") index DangerChange.component
                { text: "削除"
                , title: "コンポジションの削除"
                , message: "コンポジション「" <> show index <> "」" <> "を本当に削除しますか？"
                }
                (\_ -> Just $ DeleteComposition index)
            ]
      , HH.td []
          [ HH.slot (SProxy :: SProxy "compositionMenu") index CompositionMenu.component
              { value: comp.composition, disabled: state.readonly }
              (Just <<< ChangeComposition index)
          ]
      ]

toMaybeString :: String -> Maybe String
toMaybeString x = if x == "" then Nothing else Just x

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  ChangeComposition index composition -> do
    H.modify_ (\x -> x { compositions = modifyComp index (_ { composition = composition }) x.compositions })
  AddComposition -> do
    H.modify_ (\x -> x { compositions = x.compositions <> [ { composition: Nothing } ] })
  DeleteComposition index -> do
    H.modify_ \x -> x { compositions = catMaybes $ mapWithIndex (\index2 -> \y -> if index == index2 then Nothing else Just y) x.compositions }
  HandleInput input -> H.modify_ _ { readonly = input.readonly }
  where
  modifyComp :: Int -> (PendingContentComposition -> PendingContentComposition) -> Array PendingContentComposition -> Array PendingContentComposition
  modifyComp index modify = mapWithIndex (\index2 -> \x -> if index == index2 then modify x else x)

toContentComposition2 :: PendingContentComposition -> Maybe ContentComposition
toContentComposition2 comp = do
  composition <- comp.composition
  pure composition

handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    let
      comps = map toContentComposition2 state.compositions
    pure $ map k $ map (\x-> { compositions: map fromContentComposition x }) $ allJust $ comps
  SetValue value k -> do
    let
      compositions = map convert $ map toContentComposition value.compositions
    H.modify_ _ { compositions = compositions }
    pure $ Just k
    where
    convert :: ContentComposition -> PendingContentComposition
    convert comp = { composition: Just comp }
