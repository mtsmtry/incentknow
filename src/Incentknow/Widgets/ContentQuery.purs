module Incentknow.Widgets.ContentQuery where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromArray, fromBoolean, fromNumber, fromObject, fromString, isArray, isBoolean, isNumber, isObject, isString, jsonNull, stringify, toArray, toBoolean, toNumber, toObject, toString)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (catMaybes, concat, head, length, mapWithIndex)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Int as Int
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.String (Pattern(..), joinWith, split)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Foreign.JSON (parseJSON)
import Foreign.Object (Object)
import Foreign.Object as O
import Global (decodeURI, decodeURIComponent, encodeURI, encodeURIComponent)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch, forFetchItem)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button, checkbox, submitButton, textarea)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Page (toJson)
import Incentknow.Data.Property (PropertyInfo, toPropertyInfo)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)
import Test.Unit.Console (consoleLog)

type Input
  = { spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    , urlParams :: Array (Tuple String (Maybe String))
    }

data FilterValue
  = ValueInt Int
  | ValueBoolean Boolean
  | ValueString String
  | ValueObject (Map String FilterValue)
  | ValueNone
 
instance showFilterValue :: Show FilterValue where
  show = case _ of
    ValueInt vl -> show vl
    ValueBoolean vl -> show vl
    ValueString vl -> show vl
    ValueObject obj -> "ValueObject" <> show obj
    ValueNone -> "none"

type State
  = { spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    , values :: Map String (Array FilterValue)
    , format :: Remote Format
    , urlParams :: Array (Tuple String (Maybe String))
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeSpace (Maybe SpaceId)
  | ChangeFormat (Maybe FormatId)
  | ChangeValue ValueId FilterValue
  | ChangeObjectValue ValueId String FilterValue
  | AddValue String
  | Fetch
  | FetchedFormat (Fetch Format)

decodeUriValue :: String -> String
decodeUriValue str = str -- fromMaybe "uriDecodingError" $ decodeURIComponent str

encodeUriValue :: String -> String
encodeUriValue str = str -- fromMaybe "urlEncodingError" $ encodeURIComponent str

fromUrlParams :: Array (Tuple String (Maybe String)) -> Array PropertyInfo -> Map String (Array FilterValue)
fromUrlParams params props = M.fromFoldable $ map (\(Tuple id vls) -> Tuple id $ toValues id (fromMaybe "" vls)) params
  where
  objToArray :: forall a. Object a -> Array (Tuple String a)
  objToArray = O.toUnfoldable

  toValues :: String -> String -> Array FilterValue
  toValues id vls = maybe [] (\ty-> toValues' ty vls) maybeType
    where
    prop = M.lookup id $ toPropertyMap props
    maybeType = map _.type prop
  
    toValues' :: Type -> String -> Array FilterValue
    toValues' ty vls =
      case ty of
        ArrayType args -> toValues' args.type vls
        ObjectType _ -> case runExcept $ parseJSON vls of
          Right frg -> if isArray json then
              catMaybes $ map fromJson $ fromMaybe [] $ toArray json
            else
              catMaybes $ [ fromJson json ]
            where
            json = toJson frg
          _ -> []
        _ -> map (\vl-> fromMaybe ValueNone $ toValue vl ty) $ split (Pattern ",") vls

  fromJson :: Json -> Maybe FilterValue
  fromJson json =
    if isString json then
      map ValueString $ toString json
    else
      if isNumber json then
        map ValueInt $ flatten $ map Int.fromNumber $ toNumber json
      else
        if isBoolean json then
          map ValueBoolean $ toBoolean json
        else
          if isObject json then
            map (ValueObject <<< map (fromMaybe ValueNone <<< fromJson) <<< M.fromFoldable <<< objToArray) $ toObject json
          else
            Nothing

  toValue :: String -> Type -> Maybe FilterValue
  toValue urlValueStr = case _ of
    IntType _ -> map ValueInt $ Int.fromString str
    StringType _ -> Just $ ValueString str
    ContentType _ -> Just $ ValueString str
    ArrayType args -> toValue str args.type
    _ -> Nothing
    where
    str = decodeUriValue urlValueStr

toUrlParams :: Map String (Array FilterValue) -> Array (Tuple String (Maybe String))
toUrlParams m = map (\(Tuple key vls) -> Tuple key $ Just $ showValues vls) $ M.toUnfoldable m
  where
  -- 複数ある場合、Objectは配列のJSON、Object以外は文字列のコンマ区切り
  showValues :: Array FilterValue -> String
  showValues vls = case vls of
    [ vl ] -> showValue vl
    _ -> case head vls of 
      Just (ValueObject obj) -> encodeUriValue $ stringify $ fromArray $ map toJson vls
      _ -> joinWith "," $ map showValue vls

    where
    showValue :: FilterValue -> String
    showValue = case _ of
      ValueInt vl -> show vl
      ValueBoolean vl -> show vl
      ValueString vl -> encodeUriValue vl
      ValueObject obj -> encodeUriValue $ stringify $ toJson $ ValueObject obj
      ValueNone -> show "null"

  toJson :: FilterValue -> Json
  toJson = case _ of
    ValueInt vl -> fromNumber $ Int.toNumber vl
    ValueBoolean vl -> fromBoolean vl
    ValueString vl -> fromString vl
    ValueObject obj -> fromObject $ O.fromFoldable tuples
      where
      tuples :: Array (Tuple String Json)
      tuples = M.toUnfoldable $ map toJson obj
    ValueNone -> jsonNull

toPropertyMap :: Array PropertyInfo -> Map String PropertyInfo
toPropertyMap props = M.fromFoldable $ map (\prop -> Tuple prop.id prop) props

toContentFilters :: Map String (Array FilterValue) -> Array PropertyInfo -> Array ContentFilter
toContentFilters m props = concat $ map (\(Tuple id vls) -> toContentFilter id vls) array
  where
  propMap = toPropertyMap props

  array :: Array (Tuple String (Array FilterValue))
  array = M.toUnfoldable m

  toValue :: FilterValue -> Json
  toValue = case _ of
    ValueInt vl -> fromNumber $ Int.toNumber vl
    ValueBoolean vl -> fromBoolean vl
    ValueString vl -> fromString vl
    ValueObject vl -> jsonNull
    ValueNone -> jsonNull

  toContentFilter :: String -> Array FilterValue -> Array ContentFilter
  toContentFilter id vls = toContentFilter' id vls $ M.lookup id propMap

  toContentFilter' :: String -> Array FilterValue -> Maybe PropertyInfo -> Array ContentFilter
  toContentFilter' id vls prop =
    if length vls == 0 then
      []
    else case vls, map _.type prop of
      [ vl ], Just (ArrayType _) -> [ { propertyIds: [ id ], operation: ArrayContains $ toValue vl } ]
      [ vl ], _ -> [ { propertyIds: [ id ], operation: Equal $ toValue vl } ]
      _, Just (ArrayType _) -> [ { propertyIds: [ id ], operation: ArrayContainsAny $ fromArray $ map toValue vls } ]
      _, _ -> [ { propertyIds: [ id ], operation: In $ fromArray $ map toValue vls } ]

  toChild :: String -> Map String FilterValue -> Array ContentFilter
  toChild id obj = []

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( spaceMenu :: SpaceMenu.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
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
  , values: M.empty
  , urlParams: input.urlParams
  , format: Loading
  }

type ValueId
  = Tuple String Int

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "wid-content-query"
    [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component { value: state.spaceId, disabled: false } (Just <<< ChangeSpace)
    , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.spaceId, disabled: false } (Just <<< ChangeFormat)
    , remoteWith state.format \format ->
        HH.div [] (map renderProperty $ map toPropertyInfo format.structure.properties)
    , submitButton
        { isDisabled: isNothing state.spaceId || isNothing state.formatId
        , isLoading: false
        , text: "表示"
        , loadingText: "表示中"
        , onClick: Fetch
        }
    ]
  where
  renderProperty :: PropertyInfo -> H.ComponentHTML Action ChildSlots m
  renderProperty prop =
    HH.div []
      [ HH.div []
          [ HH.span [] [ HH.text prop.displayName ]
          , button "追加" $ AddValue prop.id
          ]
      , renderValues prop.id prop.type $ fromMaybe [ ValueNone ] $ M.lookup prop.id state.values
      ]
    where
    renderValues :: String -> Type -> Array FilterValue -> H.ComponentHTML Action ChildSlots m
    renderValues id ty values = HH.div [] (mapWithIndex (\idx -> \vl -> renderValue (Tuple id idx) ty vl) values)

    renderValue :: ValueId -> Type -> FilterValue -> H.ComponentHTML Action ChildSlots m
    renderValue id ty vl = case ty of
      IntType _ -> renderAtomValue AtomInt change vl
      StringType _ -> renderAtomValue AtomString change vl
      BoolType _ -> renderAtomValue AtomBool change vl
      ArrayType args -> renderValue id args.type vl
      ObjectType args ->
        HH.div []
          (map (\prop -> renderObjectProperty id prop (getProp prop.id)) args.properties)
        where
        obj = case vl of
          ValueObject x -> x
          _ -> M.empty

        getProp field = fromMaybe ValueNone $ M.lookup field obj
      FormatType _ -> HH.text ""
      SpaceType _ -> HH.text ""
      ContentType _ -> HH.text ""
      EnumType _ -> HH.text ""
      TextType _ -> HH.text ""
      CodeType _ -> HH.text ""
      UrlType _ -> HH.text ""
      DocumentType _ -> HH.text ""
      EntityType _ -> HH.text ""
      ImageType _ -> HH.text ""
      where
      change = ChangeValue id

    renderObjectProperty :: ValueId -> PropertyInfo -> FilterValue -> H.ComponentHTML Action ChildSlots m
    renderObjectProperty parentId prop vl =
      HH.div []
        [ HH.text prop.displayName
        , renderObjectValue parentId prop.id prop.type vl
        ]

    renderObjectValue :: ValueId -> String -> Type -> FilterValue -> H.ComponentHTML Action ChildSlots m
    renderObjectValue parentId id ty vl = case ty of
      IntType _ -> renderAtomValue AtomInt change vl
      StringType _ -> renderAtomValue AtomString change vl
      BoolType _ -> renderAtomValue AtomBool change vl
      ArrayType args -> renderObjectValue parentId id args.type vl
      FormatType _ -> HH.text ""
      SpaceType _ -> HH.text ""
      ContentType _ -> HH.text ""
      EnumType _ -> HH.text ""
      ObjectType args -> HH.text ""
      TextType _ -> HH.text ""
      CodeType _ -> HH.text ""
      UrlType _ -> HH.text ""
      DocumentType _ -> HH.text ""
      EntityType _ -> HH.text ""
      ImageType _ -> HH.text ""
      where
      change = ChangeObjectValue parentId id

    renderAtomValue :: AtomType -> (FilterValue -> Action) -> FilterValue -> H.ComponentHTML Action ChildSlots m
    renderAtomValue ty change vl = case ty of
      AtomInt -> HH.text ""
      AtomString ->
        textarea
          { onChange: change <<< ValueString
          , placeholder: ""
          , value:
              case vl of
                ValueString str -> str
                _ -> ""
          }
      AtomBool -> HH.text "" -- checkbox "" true

data AtomType
  = AtomInt
  | AtomString
  | AtomBool

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.formatId \id ->
      fetchApi FetchedFormat $ getFormat id
    H.liftEffect $ consoleLog $ show $ state.urlParams
  ChangeSpace spaceId -> do
    H.modify_ _ { spaceId = spaceId }
    navigateNewUrl
  ChangeFormat formatId -> do
    H.modify_ _ { formatId = formatId, format = Loading }
    for_ formatId \id ->
      fetchApi FetchedFormat $ getFormat id
    navigateNewUrl
  HandleInput input -> do
    state <- H.get
    when (input.spaceId /= state.spaceId || input.formatId /= state.formatId || input.urlParams /= state.urlParams) do
      H.put $ initialState input
      handleAction Initialize
  ChangeValue id vl -> do
    H.modify_ \s -> s { values = modifyValue id (\_ -> vl) s.values }
    s <- H.get
    H.liftEffect $ consoleLog $ show s.values
  ChangeObjectValue id childId vl -> do
    let
      modifyChild = case _ of
        ValueObject obj -> ValueObject $ M.insert childId vl obj
        _ -> ValueObject $ M.fromFoldable [ Tuple childId vl ]
    H.modify_ \s -> s { values = modifyValue id modifyChild s.values }
    s <- H.get
    H.liftEffect $ consoleLog $ show s.values
  AddValue id -> do
    H.modify_ \s -> s { values = modifyProp id (\vls -> vls <> [ ValueNone ]) s.values }
    s <- H.get
    H.liftEffect $ consoleLog $ show s.values
  Fetch -> navigateNewUrl
  FetchedFormat fetch -> do
    forFetch fetch \format ->
      H.modify_ _ { format = format }
    forFetchItem fetch \format -> do
      H.modify_ \s -> s { values = fromUrlParams s.urlParams $ map toPropertyInfo format.structure.properties }
      s <- H.get
      H.liftEffect $ consoleLog $ show s.values
  where
  modifyProp :: String -> (Array FilterValue -> Array FilterValue) -> Map String (Array FilterValue) -> Map String (Array FilterValue)
  modifyProp id change = M.alter (\x -> Just $ change $ fromMaybe [ ValueNone ] x) id

  modifyValue :: ValueId -> (FilterValue -> FilterValue) -> Map String (Array FilterValue) -> Map String (Array FilterValue)
  modifyValue (Tuple id idx) change = modifyProp id $ mapWithIndex (\idx2 -> \vl -> if idx == idx2 then change vl else vl)

  navigateNewUrl = do
    state <- H.get
    navigate $ ContentList state.spaceId state.formatId $ toUrlParams state.values
