module Incentknow.Organisms.Structure where

import Prelude
import Data.Array (concat, filter, length, range)
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
import Incentknow.Data.Ids (SpaceId(..), generateId)
import Incentknow.Data.Property (Enumerator, Property, PropertyInfo, Type(..), getTypeName)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.Enumeration as Enumeration

type Input
  = { readonly :: Boolean
    , spaceId :: SpaceId
    }

type PendingPropertyInfo
  = { id :: String
    , displayName :: Maybe String
    , fieldName :: Maybe String
    , type :: Maybe Type
    , semantic :: Maybe String
    , optional :: Boolean
    }

type State
  = { props :: Array PendingPropertyInfo
    , readonly :: Boolean
    , spaceId :: SpaceId
    }

data Action
  = ChangeDisplayName String String
  | ChangeFieldName String String
  | ChangeType String (Maybe Type)
  | ChangeSemantic String String
  | ChangeOptional String Boolean
  | AddProperty
  | DeleteProperty String
  | HandleInput Input

data Query a
  = GetValue (Array PropertyInfo -> a)
  | SetValue (Array PropertyInfo) a

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( typeMenu :: TypeMenu.Slot String
    , formatMenu :: FormatMenu.Slot String
    , structure :: Slot String
    , enumeration :: Enumeration.Slot String
    , delete :: DangerChange.Slot String
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

setInput :: Input -> State -> State
setInput input state = state { readonly = input.readonly, spaceId = input.spaceId }

initialState :: Input -> State
initialState input = setInput input { props: [], readonly: true, spaceId: wrap "" }

structure_ = SProxy :: SProxy "structure"

enumeration_ = SProxy :: SProxy "enumeration"

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-structure" ]
    [ if not state.readonly then
        HH.div
          [ css "buttons-area" ]
          [ button "追加" AddProperty ]
      else
        HH.text ""
    , HH.table_
        [ HH.thead
            []
            [ HH.tr []
                [ whenElem (not state.readonly) \_ ->
                    HH.th [] [ HH.text "" ]
                , HH.th [] [ HH.text "ID" ]
                , HH.th [] [ HH.text "フィールド名" ]
                , HH.th [] [ HH.text "表示名" ]
                , HH.th [] [ HH.text "型" ]
                , HH.th [] [ HH.text "意味" ]
                , HH.th [] [ HH.text "Optional" ]
                ]
            ]
        , HH.tbody
            []
            (concat $ map property state.props)
        ]
    ]
  where
  property :: PendingPropertyInfo -> Array (H.ComponentHTML Action ChildSlots m)
  property prop =
    [ HH.tr
        []
        [ whenElem (not state.readonly) \_ ->
            HH.td []
              [ HH.slot (SProxy :: SProxy "delete") prop.id DangerChange.component
                  { text: "削除"
                  , title: "プロパティの削除"
                  , message: "プロパティ「" <> (fromMaybe prop.id prop.displayName) <> "」" <> "を本当に削除しますか？"
                  }
                  (\_ -> Just $ DeleteProperty prop.id)
              ]
        , HH.td []
            [ HH.text prop.id ]
        , HH.td []
            [ if state.readonly then
                HH.text $ fromMaybe "" prop.fieldName
              else
                textarea
                  { value: fromMaybe "" prop.fieldName
                  , placeholder: ""
                  , onChange: ChangeFieldName prop.id
                  }
            ]
        , HH.td []
            [ if state.readonly then
                HH.text $ fromMaybe "" prop.displayName
              else
                textarea
                  { value: fromMaybe "" prop.displayName
                  , placeholder: ""
                  , onChange: ChangeDisplayName prop.id
                  }
            ]
        , HH.td []
            [ if state.readonly then
                HH.text $ fromMaybe "" $ map getTypeName prop.type
              else
                HH.slot (SProxy :: SProxy "typeMenu") prop.id TypeMenu.component
                  { value: prop.type, exceptions: [ "object" ], spaceId: state.spaceId, disabled: false }
                  (Just <<< ChangeType prop.id)
            ]
        , HH.td []
            [ if state.readonly then
                HH.text $ fromMaybe "" prop.semantic
              else
                textarea
                  { value: fromMaybe "" prop.semantic
                  , placeholder: ""
                  , onChange: ChangeSemantic prop.id
                  }
            ]
        , HH.td []
            [ if state.readonly then
                HH.text $ fromMaybe "" prop.semantic
              else
                checkbox "" prop.optional (ChangeOptional prop.id) false
            ]
        ]
    , maybeElem (flatten $ map getSubStructure prop.type) \props ->
        HH.tr []
          [ HH.td [ HP.colSpan 7 ]
              [ HH.slot structure_ prop.id component
                  { readonly: state.readonly, spaceId: state.spaceId }
                  absurd
              ]
          ]
    , maybeElem (flatten $ map getEnumerators prop.type) \enums ->
        HH.tr []
          [ HH.td [ HP.colSpan 7 ]
              [ HH.slot (SProxy :: SProxy "enumeration") prop.id Enumeration.component
                  { value: enums, readonly: state.readonly }
                  absurd
              ]
          ]
    ]

getSubStructure :: Type -> Maybe (Array PropertyInfo)
getSubStructure ty = case ty of
  ArrayType args -> case args.type of
    ObjectType objArgs -> Just objArgs.properties
    _ -> Nothing
  _ -> Nothing

getEnumerators :: Type -> Maybe (Array Enumerator)
getEnumerators ty = case ty of
  EnumType args -> Just args.enumerators
  _ -> Nothing

setSubStructure :: Array PropertyInfo -> Type -> Type
setSubStructure properties ty = case ty of
  ArrayType args -> case args.type of
    ObjectType objArgs -> ArrayType $ args { type = ObjectType $ objArgs { properties = properties } }
    _ -> ty
  _ -> ty

setEnumerators :: Array Enumerator -> Type -> Type
setEnumerators enumerators ty = case ty of
  EnumType args -> EnumType $ args { enumerators = enumerators }
  _ -> ty

toMaybeString :: String -> Maybe String
toMaybeString x = if x == "" then Nothing else Just x

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  ChangeDisplayName id displayName -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { displayName = toMaybeString displayName }) x.props })
  ChangeFieldName id fieldName -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { fieldName = toMaybeString fieldName }) x.props })
  ChangeType id ty -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { type = ty }) x.props })
  ChangeSemantic id semantic -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { semantic = toMaybeString semantic }) x.props })
  ChangeOptional id optional -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { optional = optional }) x.props })
  AddProperty -> do
    newId <- generateId 4
    H.modify_ (\x -> x { props = x.props <> [ { displayName: Nothing, fieldName: Nothing, semantic: Nothing, id: newId, type: Nothing, optional: false } ] })
  DeleteProperty id -> do
    H.modify_ \x -> x { props = filter (\y -> y.id /= id) x.props }
  HandleInput input -> H.modify_ $ setInput input
  where
  modifyProp :: String -> (PendingPropertyInfo -> PendingPropertyInfo) -> Array PendingPropertyInfo -> Array PendingPropertyInfo
  modifyProp id modify = map (\x -> if x.id == id then modify x else x)

toPropertyInfo :: PendingPropertyInfo -> Maybe PropertyInfo
toPropertyInfo prop = do
  name <- prop.displayName
  ty <- prop.type
  pure
    { id: prop.id
    , displayName: name
    , fieldName: prop.fieldName
    , type: ty
    , semantic: prop.semantic
    , optional: prop.optional
    }

getTypeArguments :: forall o m a. PendingPropertyInfo -> H.HalogenM State Action ChildSlots o m PendingPropertyInfo
getTypeArguments prop = do
  argProps <- H.query structure_ prop.id (H.request GetValue)
  argEnum <- H.query enumeration_ prop.id (H.request Enumeration.GetValue)
  case argProps, argEnum of
    Just props, _ -> pure $ prop { type = map (setSubStructure props) prop.type }
    _, Just enums -> pure $ prop { type = map (setEnumerators enums) prop.type }
    _, _ -> pure prop

handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    newProps <- for state.props getTypeArguments
    let
      props = map toPropertyInfo newProps
    pure $ map k $ allJust $ props
  SetValue value k -> do
    let
      props = map convert value
    H.modify_ _ { props = props }
    for_ props \prop -> do
      for_ (flatten $ map getSubStructure prop.type) \childProps ->
        H.query structure_ prop.id (H.tell $ SetValue childProps)
    pure $ Just k
    where
    convert :: PropertyInfo -> PendingPropertyInfo
    convert prop =
      { id: prop.id
      , displayName: Just prop.displayName
      , fieldName: prop.fieldName
      , type: Just prop.type
      , semantic: prop.semantic
      , optional: prop.optional
      }
