module Incentknow.Molecules.TypeMenu where

import Prelude

import Data.Array (elem, filter, notElem)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Property (Enumerator, PropertyInfo, Type(..), getTypeName)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu

type Input
  = { value :: Maybe Type
    , exceptions :: Array String
    , spaceId :: SpaceId
    , disabled :: Boolean
    }

type TypeArguments
  = { format :: Maybe FormatId
    , space :: Maybe SpaceId
    , language :: Maybe String
    , type :: Maybe Type
    , properties :: Maybe (Array PropertyInfo)
    , enumerators :: Maybe (Array Enumerator)
    }

defaultTypeArguments :: TypeArguments
defaultTypeArguments =
  { format: Nothing
  , space: Nothing
  , language: Nothing
  , type: Nothing
  , properties: Just [] -- これは外部で設定するので、mkTypeでNothingが出力されないようにダミーのデフォルト値を設定
  , enumerators: Nothing
  }

getTypeArguments :: Type -> TypeArguments
getTypeArguments = case _ of
  IntType args -> defaultTypeArguments
  StringType args -> defaultTypeArguments
  BoolType args -> defaultTypeArguments
  TextType args -> defaultTypeArguments
  FormatType args -> defaultTypeArguments
  SpaceType args -> defaultTypeArguments
  ContentType args -> defaultTypeArguments { format = Just args.format }
  CodeType args -> defaultTypeArguments { language = args.language }
  ArrayType args -> defaultTypeArguments { type = Just args.type }
  UrlType args -> defaultTypeArguments
  ObjectType args -> defaultTypeArguments { properties = Just args.properties }
  DocumentType args -> defaultTypeArguments
  EnumType args -> defaultTypeArguments { enumerators = Just args.enumerators }
  EntityType args -> defaultTypeArguments { format = Just args.format }
  ImageType args -> defaultTypeArguments

mkType :: String -> TypeArguments -> Maybe Type
mkType name args = case name of
  "integer" -> pure $ IntType {}
  "string" -> pure $ StringType {}
  "text" -> pure $ TextType {}
  "format" -> pure $ FormatType {}
  "boolean" -> pure $ BoolType {}
  "space" -> pure $ SpaceType {}
  "content" -> do
    format <- args.format
    pure $ ContentType { format }
  "code" -> pure $ CodeType { language: args.language }
  "array" -> do
    ty <- args.type
    pure $ ArrayType { type: ty }
  "url" -> pure $ UrlType {}
  "object" -> do
    properties <- args.properties
    pure $ ObjectType { properties }
  "document" -> pure $ DocumentType {}
  "enumeration" -> do
    enumerators <- args.enumerators
    pure $ EnumType { enumerators }
  "entity" -> do
    format <- args.format
    pure $ EntityType { format }
  "image" -> pure $ ImageType {}
  _ -> Nothing

type State
  = { typeNameItems :: Array SelectMenuItem
    , langNameItems :: Array SelectMenuItem
    , typeName :: Maybe String
    , typeArgs :: TypeArguments
    , exceptions :: Array String
    , spaceId :: SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeTypeName (Maybe String)
  | ChangeFormat (Maybe FormatId)
  | ChangeLangName (Maybe String)
  | ChangeArgType (Maybe Type)
  | ChangeSpace (Maybe SpaceId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    , langMenu :: SelectMenu.Slot Unit
    , typeMenu :: Slot Unit
    )

type Output
  = Maybe Type

component :: forall q m. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          $ H.defaultEval
              { initialize = Just Initialize
              , handleAction = handleAction
              , receive = Just <<< HandleInput
              }
    }

type Item
  = { id :: String
    , name :: String
    , desc :: String
    }

typeItems :: Array Item
typeItems =
  [ { id: "integer", name: "Integer", desc: "整数" }
  , { id: "string", name: "String", desc: "文字列(改行なし)" }
  , { id: "text", name: "Text", desc: "文字列(改行あり)" }
  , { id: "decimal", name: "Decimal", desc: "少数" }
  , { id: "boolean", name: "Boolean", desc: "ブール値" }
  , { id: "enumeration", name: "Enum", desc: "列挙体" }
  , { id: "format", name: "Format", desc: "フォーマット" }
  , { id: "space", name: "Space", desc: "スペース" }
  , { id: "content", name: "Content", desc: "コンテンツ" }
  , { id: "code", name: "SourceCode", desc: "ソースコード" }
  , { id: "url", name: "URL", desc: "URL" }
  , { id: "array", name: "Array", desc: "配列" }
  , { id: "object", name: "Object", desc: "オブジェクト" }
  , { id: "document", name: "Document", desc: "ドキュメント" }
  , { id: "entity", name: "Entity", desc: "エンティティ" }
  , { id: "image", name: "Image", desc: "画像" }
  ]

langItems :: Array Item
langItems =
  [ { id: "python", name: "Python", desc: "" }
  , { id: "javascript", name: "JavaScript", desc: "" }
  , { id: "r", name: "R", desc: "" }
  , { id: "json", name: "JSON", desc: "" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem
toSelectMenuItem format =
  { id: format.id
  , name: format.name
  , searchWord: format.name
  , html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div []
      [ HH.div [ css "name" ] [ HH.text format.name ]
      , HH.div [ css "desc" ] [ HH.text format.desc ]
      ]

initialState :: Input -> State
initialState input =
  { typeNameItems: map toSelectMenuItem $ filter (\x -> notElem x.id input.exceptions) typeItems
  , langNameItems: map toSelectMenuItem langItems
  , typeName: map getTypeName input.value
  , typeArgs: fromMaybe defaultTypeArguments2 $ map getTypeArguments input.value
  , exceptions: input.exceptions
  , spaceId: input.spaceId
  , disabled: input.disabled
  }
  where
  defaultTypeArguments2 = defaultTypeArguments { space = Just input.spaceId }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { resource: SelectMenuResourceAllCandidates $ state.typeNameItems, value: state.typeName, disabled: state.disabled }
        (Just <<< ChangeTypeName)
    , case state.typeName of
        Just "content" ->
          HH.div_
            [ whenElem (isNothing state.typeArgs.format) \_ ->
                HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                  { value: state.typeArgs.space, disabled: false }
                  (Just <<< ChangeSpace)
            , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component
                { value: state.typeArgs.format, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.typeArgs.space, disabled: state.disabled }
                (Just <<< ChangeFormat)
            ]
        Just "entity" ->
          HH.div_
            [ whenElem (isNothing state.typeArgs.format) \_ ->
                HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                  { value: state.typeArgs.space, disabled: false }
                  (Just <<< ChangeSpace)
            , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component
                { value: state.typeArgs.format, filter: maybe FormatMenu.None FormatMenu.SpaceByAndHasSemanticId state.typeArgs.space, disabled: state.disabled }
                (Just <<< ChangeFormat)
            ]
        Just "code" ->
          HH.slot (SProxy :: SProxy "langMenu") unit SelectMenu.component
            { resource: SelectMenuResourceAllCandidates state.langNameItems, value: state.typeArgs.language, disabled: state.disabled }
            (Just <<< ChangeLangName)
        Just "array" ->
          HH.slot (SProxy :: SProxy "typeMenu") unit component
            { value: state.typeArgs.type, exceptions: [ "array" ], spaceId: state.spaceId, disabled: state.disabled }
            (Just <<< ChangeArgType)
        _ -> HH.text ""
    ]

buildType :: State -> Maybe (Maybe Type)
buildType state = case state.typeName of
  Just name -> case mkType name state.typeArgs of
    Just ty -> Just $ Just ty
    Nothing -> Nothing
  Nothing -> Just Nothing

-- Just Just x: 値あり
-- Just Nothing: 値なし
-- Nothing: 保留
raiseOrModify :: forall m. State -> H.HalogenM State Action ChildSlots Output m Unit
raiseOrModify state = case buildType state of
  Just value -> do
    H.raise value
    when (isNothing value) $ H.put state
  Nothing -> H.put state

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> when (isJust input.value) $ H.put $ initialState input
  ChangeFormat formatId -> do
    state <- H.get
    raiseOrModify $ state { typeArgs = state.typeArgs { format = formatId } }
  ChangeTypeName typeName -> do
    state <- H.get
    raiseOrModify $ state { typeName = typeName }
  ChangeLangName langName -> do
    state <- H.get
    raiseOrModify $ state { typeArgs = state.typeArgs { language = langName } }
  ChangeArgType argType -> do
    state <- H.get
    raiseOrModify $ state { typeArgs = state.typeArgs { type = argType } }
  ChangeSpace space -> do
    state <- H.get
    raiseOrModify $ state { typeArgs = state.typeArgs { space = space } }
