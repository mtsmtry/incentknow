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
import Incentknow.API (getFocusedFormat, getFormat)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (icon, iconSolid, propertyIcon, remoteWith, typeIcon)
import Incentknow.Atoms.Inputs (button, checkbox, numberarea, textarea)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, FocusedFormat, FocusedMaterial, FormatUsage(..), Type(..), RelatedContent)
import Incentknow.Data.EntityUtils (getTypeName)
import Incentknow.Data.Ids (ContentId, FormatId(..), MaterialId, PropertyId, SemanticId)
import Incentknow.Data.Property (Enumerator, Property, ReferenceValue(..), TypedValue(..), TypedProperty, encodeProperties, forceConvert, mkProperties, toReferenceValue)
import Incentknow.HTML.Utils (css, link, maybeElem)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.ContentMenu as ContentMenu
import Incentknow.Molecules.EntityMenu as EntityMenu
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Content.Common (EditEnvironment)
import Incentknow.Organisms.Material.SlotEditor as Material
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..))
import Test.Unit.Console (consoleLog)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: TypedValue, env :: EditEnvironment }

type State
  = { value :: TypedValue
    , env :: EditEnvironment
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue TypedValue
  | ChangeAttribute PropertyId TypedValue
  | ChangeItem Int TypedValue
  | DeleteItem Int
  | Navigate MouseEvent Route

type Output
  = TypedValue

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( aceEditor :: AceEditor.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , contentMenu :: ContentMenu.Slot Unit
    , selectMenu :: SelectMenu.Slot String Unit
    , material :: Material.Slot Unit
    , value :: Slot Int
    , property :: Slot PropertyId
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

fromEnumeratorToSelectMenuItem :: Enumerator -> SelectMenuItem String
fromEnumeratorToSelectMenuItem enum =
  { id: enum.id
  , name: enum.displayName
  , searchWord: enum.id <> enum.displayName
  , html: HH.text enum.displayName
  }

initialState :: Input -> State
initialState input =
  { value: input.value
  , env: input.env
  }

foreign import toForceRelatedContent :: ContentId -> RelatedContent

foreign import toForceRelatedContentFromSemanticId :: SemanticId -> RelatedContent

foreign import toForceFocusedMaterial :: MaterialId -> FocusedMaterial

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = case state.value of
  StringTypedValue str ->
    textarea
      { onChange: ChangeValue <<< StringTypedValue <<< toMaybeString
      , placeholder: ""
      , value: fromMaybe "" str
      }
  ImageTypedValue img ->
    textarea
      { onChange: ChangeValue <<< ImageTypedValue <<< toMaybeString
      , placeholder: ""
      , value: fromMaybe "" img
      }
  IntTypedValue int ->
    numberarea
      { onChange: ChangeValue <<< IntTypedValue
      , value: int
      }
  EnumTypedValue enums enum ->
    HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
      { initial: { items: map fromEnumeratorToSelectMenuItem enums, completed: true }
      , fetchMultiple: \_-> Nothing
      , fetchSingle: Nothing
      , fetchId: ""
      , value: enum
      , disabled: false
      }
      (Just <<< ChangeValue <<< EnumTypedValue enums)
  BoolTypedValue bool -> checkbox "" (fromMaybe false $ bool) (ChangeValue <<< BoolTypedValue <<< Just) false
  TextTypedValue text ->
    HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component { value: fromMaybe "" text, language: Nothing, variableHeight: true, readonly: false }
      (Just <<< ChangeValue <<< TextTypedValue <<< toMaybeString)
  ContentTypedValue format value ->
    HH.slot (SProxy :: SProxy "contentMenu") unit ContentMenu.component 
      { spaceId: if format.usage == Internal then Just format.space.spaceId else state.env.spaceId
      , value: map _.contentId $ toMaybeReferenceValue value
      , formatId: format.formatId
      , disabled: false }
      (Just <<< ChangeValue <<< ContentTypedValue format <<< toReferenceValueFromMaybe <<< map toForceRelatedContent)
  EntityTypedValue format content ->
    HH.slot (SProxy :: SProxy "entityMenu") unit EntityMenu.component { value: Just $ wrap "", formatId: format.formatId, disabled: false }
      (Just <<< ChangeValue <<< EntityTypedValue format <<< toReferenceValueFromMaybe <<< map toForceRelatedContentFromSemanticId)
  DocumentTypedValue doc -> HH.text ""
    -- HH.slot (SProxy :: SProxy "material") unit Material.component { value: map _.materialId $ toMaybeReferenceValue doc }
    --  (Just <<< ChangeValue <<< DocumentTypedValue <<< toReferenceValueFromMaybe <<< map toForceFocusedMaterial)
  UrlTypedValue url ->
    textarea
      { onChange: ChangeValue <<< UrlTypedValue <<< toMaybeString
      , placeholder: ""
      , value: fromMaybe "" url
      }
  ArrayTypedValue array ->
    HH.div_
      [ --button "追加" $ ChangeValue $ encodeJson $ cons jsonNull $ fromMaybe [] $ toArray state.value
       HH.div_ $ mapWithIndex renderItem array
      ]
    where
    renderItem num item =
      HH.div []
        [ HH.slot (SProxy :: SProxy "value") num component 
            { value: item, env: state.env }
            (Just <<< ChangeItem num)
        , button "削除" $ DeleteItem num
        ]

  ObjectTypedValue props -> HH.div_ $ map renderProperty props
    where
    renderProperty :: TypedProperty -> H.ComponentHTML Action ChildSlots m
    renderProperty prop =
      HH.tr
        []
        [ HH.td [ css "property-type" ]
            [ propertyIcon prop.info
            , HH.text prop.info.displayName
            ]
        , HH.td [ css "property-value" ]
            [ HH.slot (SProxy :: SProxy "property") prop.info.id component { value: prop.value, env: state.env }
                (Just <<< ChangeAttribute prop.info.id)
            ]
        ]
  where  
  toStringOrEmpty = fromMaybe "" <<< toString

  toMaybeString x = if x == "" then Nothing else Just x

  toMaybe = case _ of
    Left _ -> Nothing
    Right x -> Just x

  toReferenceValueFromMaybe :: forall a. Maybe a -> ReferenceValue a
  toReferenceValueFromMaybe = case _ of
    Just x -> JustReference x
    Nothing -> NullReference

  toMaybeReferenceValue :: forall a. ReferenceValue a -> Maybe a 
  toMaybeReferenceValue = case _ of
    JustReference x -> Just x
    _ -> Nothing

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  ChangeValue value -> do
    H.raise value
  ChangeAttribute id value -> do
    state <- H.get
    let 
      newValue = case state.value of
        ObjectTypedValue props -> ObjectTypedValue $ map (\x-> if x.info.id == id then { value, info: x.info } else x) props
        x -> x
    H.modify_ _ { value = newValue } -- 同時に複数のプロパティが編集されたときのため
    H.raise newValue
  ChangeItem index value -> do
    state <- H.get
    let
      array = case state.value of
        ArrayTypedValue array -> array
        _ -> []

      newValue = ArrayTypedValue $ mapWithIndex (\i -> \x -> if i == index then value else x) array
    H.modify_ _ { value = newValue }
    H.raise newValue
  DeleteItem index -> do
    state <- H.get
    let
      array = case state.value of
        ArrayTypedValue array -> array
        _ -> []

      newValue = ArrayTypedValue $ fromMaybe array $ deleteAt index array
    H.modify_ _ { value = newValue }
    H.raise newValue
  HandleInput input -> do
    H.put $ initialState input
  Navigate e route -> navigateRoute e route