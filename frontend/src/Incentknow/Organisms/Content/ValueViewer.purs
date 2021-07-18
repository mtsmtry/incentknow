module Incentknow.Organisms.Content.ValueViewer where

import Prelude

import Data.Argonaut.Core (Json, fromArray, fromString, jsonNull, toArray, toBoolean, toNumber, toString)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (cons, index, mapWithIndex)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Map (Map, empty, insert, lookup)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, numberarea, textarea)
import Incentknow.Data.Entities (Type(..))
import Incentknow.Data.Ids (FormatId(..), PropertyId)
import Incentknow.Data.Property (Property, encodeProperties, mkProperties)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.ContentLink as ContentLink
import Incentknow.Organisms.Material.Viewer as Material
import Incentknow.Route (ContentSpec(..))

type Input
  = { value :: Json, type :: Type }

type State
  = { value :: Json, type :: Type }

data Action
  = HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( aceEditor :: AceEditor.Slot Unit
    , contentLink :: ContentLink.Slot Unit
    , value :: Slot Int
    , property :: Slot PropertyId
    , material :: Material.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = { value: input.value, type: input.type }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = case state.type of
  EnumType enums -> HH.text $ fromMaybe "" $ (flip M.lookup) array $ toStringOrEmpty state.value
    where
    array = M.fromFoldable $ map (\x-> Tuple x.id x.displayName) enums
  StringType -> HH.text $ toStringOrEmpty state.value
  IntType -> HH.text $ fromMaybe "NaN" $ map show $ toNumber state.value
  BoolType -> HH.text $ fromMaybe "NaN" $ map show $ toBoolean state.value
  TextType -> HH.text $ toStringOrEmpty state.value
  CodeType land ->
    HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component
      { value: toStringOrEmpty state.value
      , language: Just land
      , variableHeight: true
      , readonly: true
      }
      (const Nothing)
  FormatType -> HH.text ""
  SpaceType -> HH.text ""
  ContentType formatId -> case toString state.value of
    Just contentId -> HH.slot (SProxy :: SProxy "contentLink") unit ContentLink.component { value: ContentSpecContentId $ wrap contentId } absurd
    Nothing -> HH.text ""
  EntityType formatId -> case toString state.value of
    Just semanticId -> HH.slot (SProxy :: SProxy "contentLink") unit ContentLink.component { value: ContentSpecSemanticId formatId $ wrap semanticId } absurd
    Nothing -> HH.text ""
  DocumentType ->
    HH.slot (SProxy :: SProxy "material") unit Material.component { value: map wrap $ toString state.value } absurd
  UrlType -> HH.a [ HP.href $ toStringOrEmpty state.value ] [ HH.text $ toStringOrEmpty state.value ]
  ArrayType subType -> HH.div_ $ mapWithIndex renderItem array
    where
    renderItem num item = HH.slot (SProxy :: SProxy "value") num component { value: fromMaybe jsonNull $ index array num, type: subType } absurd

    array = fromMaybe [] $ toArray state.value
  ObjectType propInfos -> HH.div_ $ map renderProperty props
    where
    props = mkProperties state.value propInfos

    renderProperty :: Property -> H.ComponentHTML Action ChildSlots m
    renderProperty prop =
      HH.dl
        []
        [ HH.dt []
            [ HH.label_ [ HH.text prop.info.displayName ] ]
        , HH.dd []
            [ HH.slot (SProxy :: SProxy "property") prop.info.id component { value: prop.value, type: prop.info.type } absurd ]
        ]
  ImageType ->
    HH.img [ HP.src $ toStringOrEmpty state.value ]
  where
  toStringOrEmpty = fromMaybe "" <<< toString

  fromStringOrNull x = if x == "" then jsonNull else fromString x

  toMaybe = case _ of
    Left _ -> Nothing
    Right x -> Just x

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
