module Incentknow.Organisms.Enumeration where

import Prelude
import Data.Array (filter)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (allJust)
import Data.Symbol (SProxy(..))
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Utils (generateId)
import Incentknow.Data.Property (Enumerator)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.DangerChange as DangerChange

type Input
  = { value :: Array Enumerator, readonly :: Boolean }

type State
  = { enums :: Array Enumerator, readonly :: Boolean }

data Action
  = Initialize
  | HandleInput Input
  | ChangeDisplayName String String
  | ChangeFieldName String String
  | DeleteEnumerator String
  | AddEnumerator

data Query a
  = GetValue (Array Enumerator -> a)

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( delete :: DangerChange.Slot String )

component :: forall o m. MonadEffect m => H.Component HH.HTML Query Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleQuery = handleQuery
            , handleAction = handleAction
            }
    }

initialState :: Input -> State
initialState input = { enums: input.value, readonly: input.readonly }

render :: forall m. MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-enumeration" ]
    [ if not state.readonly then
        HH.div
          [ css "buttons-area" ]
          [ button "追加" AddEnumerator ]
      else
        HH.text ""
    , HH.table_
        [ HH.thead
            []
            [ HH.tr []
                [ HH.th [] [ HH.text "" ]
                , HH.th [] [ HH.text "ID" ]
                , HH.th [] [ HH.text "フィールド名" ]
                , HH.th [] [ HH.text "表示名" ]
                ]
            ]
        , HH.tbody
            []
            (map renderEnumerator state.enums)
        ]
    ]
  where
  renderEnumerator :: Enumerator -> H.ComponentHTML Action ChildSlots m
  renderEnumerator enum =
    HH.tr
      []
      [ HH.td []
          [ HH.slot (SProxy :: SProxy "delete") enum.id DangerChange.component
              { text: "削除"
              , title: "列挙子の削除"
              , message: "列挙子「" <> (if enum.displayName == "" then enum.id else enum.displayName) <> "」" <> "を本当に削除しますか？"
              }
              (\_ -> Just $ DeleteEnumerator enum.id)
          ]
      , HH.td []
          [ HH.text enum.id ]
      , HH.td []
          [ if state.readonly then
              HH.text $ fromMaybe "" enum.fieldName
            else
              HH.textarea
                [ HP.value $ fromMaybe "" enum.fieldName
                , HE.onValueChange $ Just <<< ChangeFieldName enum.id
                ]
          ]
      , HH.td []
          [ if state.readonly then
              HH.text enum.displayName
            else
              HH.textarea
                [ HP.value enum.displayName
                , HE.onValueChange $ Just <<< ChangeDisplayName enum.id
                ]
          ]
      ]

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  ChangeDisplayName id displayName -> do
    H.modify_ (\x -> x { enums = modifyEnum id (_ { displayName = displayName }) x.enums })
  ChangeFieldName id fieldName -> do
    H.modify_ (\x -> x { enums = modifyEnum id (_ { fieldName = if fieldName == "" then Nothing else Just fieldName }) x.enums })
  DeleteEnumerator id -> H.modify_ \x -> x { enums = filter (\y -> y.id /= id) x.enums }
  AddEnumerator -> do
    newId <- generateId 4
    H.modify_ (\x -> x { enums = x.enums <> [ { displayName: "", fieldName: Nothing, id: newId } ] })
  where
  modifyEnum :: String -> (Enumerator -> Enumerator) -> Array Enumerator -> Array Enumerator
  modifyEnum id modify = map (\x -> if x.id == id then modify x else x)

validateEnumerator :: Enumerator -> Maybe Enumerator
validateEnumerator enum =
  if enum.displayName == "" then
    Nothing
  else
    Just enum

handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    let
      enums = map validateEnumerator state.enums
    pure $ map k $ allJust $ enums
