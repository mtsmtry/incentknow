module Incentknow.Molecules.TypeMenu where

import Prelude

import CSS.Common (initial)
import Data.Array (elem, filter, notElem)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (typeIcon)
import Incentknow.Data.Entities (Language(..), RelatedFormat, Type(..), TypeName(..), FocusedFormat)
import Incentknow.Data.EntityUtils (TypeOptions, buildType, defaultTypeOptions, getTypeName, getTypeOptions)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Property (Enumerator)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Test.Unit.Console (consoleLog)

type Input
  = { value :: Maybe Type
    , exceptions :: Array TypeName
    , spaceId :: SpaceId
    , disabled :: Boolean
    }

type State
  = { typeNameItems :: Array (SelectMenuItem TypeName)
    , langNameItems :: Array (SelectMenuItem Language)
    , typeName :: Maybe TypeName    
    , typeOptions :: TypeOptions
    , exceptions :: Array TypeName
    , spaceId :: SpaceId
    , selectedSpaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeTypeName (Maybe TypeName)
  | ChangeFormat (Maybe FormatId)
  | ChangeLangName (Maybe Language)
  | ChangeArgType (Maybe Type)
  | ChangeSpace (Maybe SpaceId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot TypeName Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    , langMenu :: SelectMenu.Slot Language Unit
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

type Item a
  = { id :: a
    , name :: String
    , desc :: String
    }

typeItems :: Array (Item TypeName)
typeItems =
  [ { id: TypeNameInt, name: "Integer", desc: "整数" }
  , { id: TypeNameString, name: "String", desc: "文字列(改行なし)" }
  , { id: TypeNameText, name: "Text", desc: "文字列(改行あり)" }
 -- , { id: TypeNameDecimal, name: "Decimal", desc: "少数" }
  , { id: TypeNameBool, name: "Boolean", desc: "ブール値" }
  , { id: TypeNameEnum, name: "Enum", desc: "列挙体" }
  , { id: TypeNameFormat, name: "Format", desc: "フォーマット" }
  , { id: TypeNameSpace, name: "Space", desc: "スペース" }
  , { id: TypeNameContent, name: "Content", desc: "コンテンツ" }
  , { id: TypeNameCode, name: "SourceCode", desc: "ソースコード" }
  , { id: TypeNameUrl, name: "URL", desc: "URL" }
  , { id: TypeNameArray, name: "Array", desc: "配列" }
  , { id: TypeNameObject, name: "Object", desc: "オブジェクト" }
  , { id: TypeNameDocument, name: "Document", desc: "ドキュメント" }
  , { id: TypeNameEntity, name: "Entity", desc: "エンティティ" }
  , { id: TypeNameImage, name: "Image", desc: "画像" }
  ]

langItems :: Array (Item Language)
langItems =
  [ { id: Python, name: "Python", desc: "" }
  , { id: Javascript, name: "JavaScript", desc: "" }
  --, { id: "r", name: "R", desc: "" }
  --, { id: Json, name: "JSON", desc: "" }
  ]

toSelectMenuItem :: forall a. Item a -> SelectMenuItem a
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

toSelectMenuItemFromType :: forall a. Item TypeName -> SelectMenuItem TypeName
toSelectMenuItemFromType format =
  { id: format.id
  , name: format.name
  , searchWord: format.name
  , html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div []
      [ typeIcon format.id
      , HH.div [ css "name" ] [ HH.text format.name ]
      , HH.div [ css "desc" ] [ HH.text format.desc ]
      ]

initialState :: Input -> State
initialState input =
  { typeNameItems: map toSelectMenuItemFromType $ filter (\x -> notElem x.id input.exceptions) typeItems
  , langNameItems: map toSelectMenuItem langItems
  , typeName: map getTypeName input.value
  , typeOptions: maybe defaultTypeOptions getTypeOptions input.value
  , exceptions: input.exceptions
  , spaceId: input.spaceId
  , selectedSpaceId: Just input.spaceId
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { value: state.typeName
        , disabled: state.disabled
        , fetchMultiple: \_-> Nothing
        , fetchSingle: Nothing
        , fetchId: ""
        , initial: { items: state.typeNameItems, completed: true }
        }
        (Just <<< ChangeTypeName)
    , case state.typeName of
        Just TypeNameContent ->
          HH.div_
            [ whenElem (isNothing state.typeOptions.format) \_ ->
                HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                  { value: state.selectedSpaceId, disabled: false }
                  (Just <<< ChangeSpace)
            , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component
                { value: map _.formatId state.typeOptions.format, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.selectedSpaceId, disabled: state.disabled }
                (Just <<< ChangeFormat)
            ]
        Just TypeNameEntity ->
          HH.div_
            [ whenElem (isNothing state.typeOptions.format) \_ ->
                HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                  { value: state.selectedSpaceId, disabled: false }
                  (Just <<< ChangeSpace)
            , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component
                { value: map _.formatId state.typeOptions.format, filter: maybe FormatMenu.None FormatMenu.SpaceByAndHasSemanticId state.selectedSpaceId, disabled: state.disabled }
                (Just <<< ChangeFormat)
            ]
        Just TypeNameCode ->
          HH.slot (SProxy :: SProxy "langMenu") unit SelectMenu.component
            { initial: { items: state.langNameItems, completed: false }
            , value: state.typeOptions.language
            , disabled: state.disabled
            , fetchMultiple: \_-> Nothing
            , fetchSingle: Nothing
            , fetchId: ""
            }
            (Just <<< ChangeLangName)
        Just TypeNameArray ->
          HH.slot (SProxy :: SProxy "typeMenu") unit component
            { value: state.typeOptions.subType, exceptions: [ TypeNameArray ], spaceId: state.spaceId, disabled: state.disabled }
            (Just <<< ChangeArgType)
        _ -> HH.text ""
    ]

buildReturnType :: State -> Maybe (Maybe Type)
buildReturnType state = case state.typeName of
  Just name -> case buildType name state.typeOptions of
    Just ty -> Just $ Just ty
    Nothing -> Nothing
  Nothing -> Just Nothing

-- Just Just x: 値あり
-- Just Nothing: 値なし
-- Nothing: 保留
raiseOrModify :: forall m. State -> H.HalogenM State Action ChildSlots Output m Unit
raiseOrModify state = case buildReturnType state of
  Just value -> do
    H.raise value
    when (isNothing value) $ H.put state
  Nothing -> H.put state

foreign import toRelatedFormat :: FormatId -> FocusedFormat

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> do
    when (isJust input.value) $ H.put $ initialState input
  ChangeFormat formatId -> do    
    state <- H.get
    raiseOrModify $ state { typeOptions = state.typeOptions { format = map toRelatedFormat formatId } }
  ChangeTypeName typeName -> do
    state <- H.get
    raiseOrModify $ state { typeName = typeName }
  ChangeLangName langName -> do
    state <- H.get
    raiseOrModify $ state { typeOptions = state.typeOptions { language = langName } }
  ChangeArgType argType -> do
    state <- H.get
    raiseOrModify $ state { typeOptions = state.typeOptions { subType = argType } }
  ChangeSpace space -> do
    state <- H.get
    raiseOrModify $ state { selectedSpaceId = space }
