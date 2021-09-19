module Incentknow.Organisms.Content.ValueViewer where

import Prelude

import Data.Argonaut.Core (fromString, jsonNull, toString)
import Data.Either (Either(..))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (propertyIcon)
import Incentknow.Data.Entities (Type(..))
import Incentknow.Data.Ids (PropertyId)
import Incentknow.Data.Property (ReferenceValue(..), TypedProperty, TypedValue(..))
import Incentknow.HTML.Utils (css, link)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.ContentLink as ContentLink
import Incentknow.Organisms.Material.Viewer as Material
import Incentknow.Route (Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: TypedValue }

type State
  = { value :: TypedValue }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

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
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = { value: input.value }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = case state.value of
  EnumTypedValue enums enum -> HH.text $ maybe "" (\x-> fromMaybe "" $ M.lookup x enumMap) enum
    where
    enumMap = M.fromFoldable $ map (\x-> Tuple x.id x.displayName) enums
  StringTypedValue str -> maybeNullWith str \x-> HH.text x
  IntTypedValue int -> maybeNullWith int \x-> HH.text $ show x
  BoolTypedValue bool -> maybeNullWith bool \x-> HH.text $ show x
  TextTypedValue refMaterial -> 
    referenceValueWith refMaterial \value->
      HH.slot (SProxy :: SProxy "material") unit Material.component { value } absurd
  ContentTypedValue _ maybeContent -> 
    referenceValueWith maybeContent \value->
      HH.slot (SProxy :: SProxy "contentLink") unit ContentLink.component { value } absurd
  EntityTypedValue _ (Right value) -> 
    HH.slot (SProxy :: SProxy "contentLink") unit ContentLink.component { value } absurd
  EntityTypedValue _ (Left str) -> HH.text $ fromMaybe "" str
  DocumentTypedValue refMaterial ->
    referenceValueWith refMaterial \value->
      HH.slot (SProxy :: SProxy "material") unit Material.component { value } absurd
  UrlTypedValue url -> maybeNullWith url \x-> HH.a [ HP.href x ] [ HH.text x ]
  ArrayTypedValue array -> HH.div [] [] -- HH.div_ $ mapWithIndex renderItem array
    --where
    --renderItem num item = HH.slot (SProxy :: SProxy "value") num component { value: fromMaybe jsonNull $ index array num, type: subType } absurd

  ObjectTypedValue props -> HH.table_ [ HH.tbody_ $ map renderProperty props ]
    where
    renderProperty :: TypedProperty -> H.ComponentHTML Action ChildSlots m
    renderProperty prop =
      HH.tr
        []
        [ HH.td [ css "property-type" ]
            ( case prop.info.type of
                ContentType format -> 
                  [ link Navigate (Container format.space.displayId format.displayId)
                      []
                      [ propertyIcon prop.info
                      , HH.text prop.info.displayName
                      ]
                  ]
                ty ->
                  [ propertyIcon prop.info
                  , HH.text prop.info.displayName
                  ]
            )
        , HH.td [ css "property-value" ]
            [ HH.slot (SProxy :: SProxy "property") prop.info.id component { value: prop.value } absurd
            ]
        ]
  ImageTypedValue url -> maybeNullWith url \x-> HH.img [ HP.src x ]
  where
  toStringOrEmpty = fromMaybe "" <<< toString

  fromStringOrNull x = if x == "" then jsonNull else fromString x

  toMaybe = case _ of
    Left _ -> Nothing
    Right x -> Just x
    
  maybeNullWith :: forall a. Maybe a -> (a -> H.ComponentHTML Action ChildSlots m) -> H.ComponentHTML Action ChildSlots m
  maybeNullWith value mk = case value of
    Just value2 -> mk value2
    Nothing -> HH.span [ css "null" ] [ HH.text "Null" ]

  referenceValueWith:: forall a. ReferenceValue a -> (a -> H.ComponentHTML Action ChildSlots m) -> H.ComponentHTML Action ChildSlots m
  referenceValueWith value mk = case value of
    JustReference value2 -> mk value2
    NullReference -> HH.span [ css "null" ] [ HH.text "Null" ]
    DeletedReference -> HH.text "削除されました"

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> do
    H.put $ initialState input
    handleAction Initialize
  Navigate e route -> navigateRoute e route