module Incentknow.Organisms.Content.ValueEditor where

import Prelude

import Data.Argonaut.Core (Json, fromArray, fromString, jsonNull, stringify, toArray, toBoolean, toString)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (cons, deleteAt, index, mapWithIndex)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Map (Map, empty, insert, lookup)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log, logShow)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Format, getFormat)
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch)
import Incentknow.Api.Utils as R
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, checkbox, numberarea, textarea)
import Incentknow.Data.Ids (FormatId(..))
import Incentknow.Data.Property (Enumerator, Property, Type(..), encodeProperties, mkProperties)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.ContentMenu as ContentMenu
import Incentknow.Molecules.EntityMenu as EntityMenu
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Content.Common (EditEnvironment)
import Incentknow.Organisms.Document as Document
import Incentknow.Organisms.Document.Section (ContentComponent)
import Test.Unit.Console (consoleLog)

type Input
  = { value :: Json, type :: Type, env :: EditEnvironment, contentComponent :: ContentComponent }

type State
  = { value :: Json
    , type :: Type
    , env :: EditEnvironment
    , contentComponent :: ContentComponent
    , format :: Remote Format
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue Json
  | ChangeAttribute String Json
  | ChangeItem Int Json
  | DeleteItem Int
  | FetchedFormat (Fetch Format)

type Output
  = Json

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( aceEditor :: AceEditor.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , contentMenu :: ContentMenu.Slot Unit
    , selectMenu :: SelectMenu.Slot Unit
    , document :: Document.Slot Unit
    , value :: Slot Int
    , property :: Slot String
    , entityMenu :: EntityMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

fromEnumeratorToSelectMenuItem :: Enumerator -> SelectMenuItem
fromEnumeratorToSelectMenuItem enum =
  { id: enum.id
  , name: enum.displayName
  , searchWord: enum.id <> enum.displayName
  , html: HH.text enum.displayName
  }

initialState :: Input -> State
initialState input =
  { value: input.value
  , type: input.type
  , env: input.env
  , contentComponent: input.contentComponent
  , format: Loading
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = case state.type of
  StringType args ->
    textarea
      { onChange: ChangeValue <<< fromStringOrNull
      , placeholder: ""
      , value: toStringOrEmpty state.value
      }
  ImageType args ->
    textarea
      { onChange: ChangeValue <<< fromStringOrNull
      , placeholder: ""
      , value: toStringOrEmpty state.value
      }
  IntType args ->
    numberarea
      { onChange: ChangeValue <<< encodeJson
      , value: toMaybe $ decodeJson state.value
      }
  EnumType args ->
    HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
      { resource: SelectMenuResourceAllCandidates $ map fromEnumeratorToSelectMenuItem args.enumerators
      , value: toString state.value
      , disabled: false
      }
      (Just <<< ChangeValue <<< maybe jsonNull fromString)
  BoolType args -> checkbox "" (fromMaybe false $ toBoolean state.value) (ChangeValue <<< encodeJson) false
  TextType args ->
    HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component { value: toStringOrEmpty state.value, language: Nothing, variableHeight: true, readonly: false }
      (Just <<< ChangeValue <<< fromStringOrNull)
  CodeType args ->
    HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component { value: toStringOrEmpty state.value, language: args.language, variableHeight: true, readonly: false }
      (Just <<< ChangeValue <<< fromStringOrNull)
  FormatType args ->
    HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: map wrap $ toString state.value, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.env.spaceId, disabled: false }
      (Just <<< ChangeValue <<< maybe jsonNull (fromString <<< unwrap))
  SpaceType args ->
    HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component { value: map wrap $ toString state.value, disabled: false }
      (Just <<< ChangeValue <<< maybe jsonNull (fromString <<< unwrap))
  ContentType args ->
    HH.slot (SProxy :: SProxy "contentMenu") unit ContentMenu.component { spaceId: maybe Nothing (\x-> if x.usage == "internal" then Nothing else state.env.spaceId) $ R.toMaybe state.format, value: map wrap $ toString state.value, formatId: args.format, disabled: false }
      (Just <<< ChangeValue <<< maybe jsonNull (fromString <<< unwrap))
  EntityType args ->
    HH.slot (SProxy :: SProxy "entityMenu") unit EntityMenu.component { value: map wrap $ toString state.value, formatId: args.format, disabled: false }
      (Just <<< ChangeValue <<< maybe jsonNull (fromString <<< unwrap))
  DocumentType args -> HH.slot (SProxy :: SProxy "document") unit Document.component { value: state.value, env: state.env, contentComponent: state.contentComponent } (Just <<< ChangeValue)
  UrlType args ->
    textarea
      { onChange: ChangeValue <<< fromStringOrNull
      , placeholder: ""
      , value: toStringOrEmpty state.value
      }
  ArrayType args ->
    HH.div_
      [ button "追加" $ ChangeValue $ encodeJson $ cons jsonNull $ fromMaybe [] $ toArray state.value
      , HH.div_ $ mapWithIndex renderItem array
      ]
    where
    renderItem num item =
      HH.div []
        [ HH.slot (SProxy :: SProxy "value") num component { value: fromMaybe jsonNull $ index array num, type: args.type, env: state.env, contentComponent: state.contentComponent }
            (Just <<< ChangeItem num)
        , button "削除" $ DeleteItem num
        ]

    defaultType = StringType {}

    array = fromMaybe [] $ toArray state.value
  ObjectType args -> HH.div_ $ map renderProperty props
    where
    props = mkProperties state.value args.properties

    renderProperty :: Property -> H.ComponentHTML Action ChildSlots m
    renderProperty prop =
      HH.dl
        []
        [ HH.dt []
            [ HH.label_ [ HH.text prop.info.displayName ] ]
        , HH.dd []
            [ HH.slot (SProxy :: SProxy "property") prop.info.id component { value: prop.value, type: prop.info.type, env: state.env, contentComponent: state.contentComponent }
                (Just <<< ChangeAttribute prop.info.id)
            ]
        ]
  where
  toStringOrEmpty = fromMaybe "" <<< toString

  fromStringOrNull x = if x == "" then jsonNull else fromString x

  toMaybe = case _ of
    Left _ -> Nothing
    Right x -> Just x

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    case state.format of
      Loading ->
        case state.type of
          ContentType args -> fetchApi FetchedFormat $ getFormat args.format
          _ -> pure unit
      _ -> pure unit
  ChangeValue value -> do
    logShow $ stringify value
    H.raise value
  ChangeAttribute id value -> do
    state <- H.get
    logShow "ChangeAttribute"
    logShow id
    logShow $ stringify value
    let
      properties = case state.type of
        ObjectType args -> args.properties
        _ -> []
    let
      props = mkProperties state.value properties
    let
      changeProp props id value = map (\prop -> if prop.info.id == id then prop { value = value } else prop) props
    let
      newValue = encodeProperties $ changeProp props id value
    H.modify_ _ { value = newValue } -- 同時に複数のプロパティが編集されたときのため
    H.raise newValue
  ChangeItem index value -> do
    state <- H.get
    let
      array = fromMaybe [] $ toArray state.value
    let
      newArray = mapWithIndex (\i -> \x -> if i == index then value else x) array
    let
      newValue = encodeJson newArray
    H.modify_ _ { value = newValue }
    H.raise newValue
  DeleteItem index -> do
    state <- H.get
    let
      array = fromMaybe [] $ toArray state.value
    let
      newArray = fromMaybe array $ deleteAt index array
    let
      newValue = encodeJson newArray
    H.modify_ _ { value = newValue }
    H.raise newValue
  HandleInput input -> do
    state <- H.get
    if state.type == input.type then
      H.put $ (initialState input) { format = state.format }
    else do
      H.put $ initialState input
      handleAction Initialize
  FetchedFormat fetch ->
    forFetch fetch \format -> do
      state <- H.modify _ { format = format }
      H.liftEffect $ consoleLog $ show $ map unwrap $ maybe Nothing (\x-> if x.usage == "internal" then Nothing else state.env.spaceId) $ R.toMaybe state.format