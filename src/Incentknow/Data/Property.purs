module Incentknow.Data.Property where

import Prelude

import Control.Monad.Except (except, runExcept)
import Data.Argonaut.Core (Json, fromArray, fromObject, jsonNull, stringify, toArray, toNumber, toString)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Array (concat, cons, filter, foldl, fromFoldable, length, singleton, uncons)
import Data.Either (Either(..), either)
import Data.Int as Int
import Data.List (List)
import Data.List.NonEmpty as NEL
import Data.Map (Map, values)
import Data.Map as M
import Data.Map.Utils (decodeToMap, mergeFromArray)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.Nullable (Nullable, toMaybe, toNullable)
import Data.Tuple (Tuple(..), uncurry)
import Foreign (F, Foreign, ForeignError(..), readString)
import Foreign.Object as F
import Foreign.Object as Object
import Incentknow.Data.Ids (SpaceId(..), ContentId(..), FormatId(..))
import Incentknow.Route (Route)
import Simple.JSON (class ReadForeign, class WriteForeign, readImpl, writeImpl)

type Enumerator
  = { id :: String
    , displayName :: String
    , fieldName :: Maybe String
    }

type EnumeratorImpl
  = { id :: String
    , displayName :: String
    , fieldName :: Nullable String
    }

-- オブジェクトは、自動で間違ったreadImplとwriteImplが生成されてしまうため、
-- 引数にオブジェクトを含む物は手動でreadImplとwriteImplを書く必要がある
-- 自動生成の場合、例えば、{ aa: Just "tt" }は、{ aa: undefined }になる
data Type
  = IntType {}
  | BoolType {}
  | StringType {}
  | FormatType {}
  | SpaceType {}
  | ContentType { format :: FormatId }
  | ArrayType { type :: Type }
  | UrlType {}
  | EnumType { enumerators :: Array Enumerator }
  | EntityType { format :: FormatId }
  | ImageType {}
  | TextType {}
  | CodeType { language :: Maybe String }
  | DocumentType {}
  | ObjectType { properties :: Array PropertyInfo }

derive instance eqType :: Eq Type

type TypeImpl
  = { name :: String
    , arguments :: Foreign
    }

instance readForeignType :: ReadForeign Type where
  readImpl src = do
    impl <- readImpl src :: F TypeImpl
    case impl.name of
      "integer" -> IntType <$> readImpl impl.arguments
      "string" -> StringType <$> readImpl impl.arguments
      "text" -> TextType <$> readImpl impl.arguments
      "format" -> FormatType <$> readImpl impl.arguments
      "boolean" -> BoolType <$> readImpl impl.arguments
      "space" -> SpaceType <$> readImpl impl.arguments
      "content" -> ContentType <$> readImpl impl.arguments
      "code" -> do
        args :: { language :: Nullable String } <- readImpl impl.arguments
        pure $ CodeType { language: toMaybe args.language }
      "array" -> do
        args :: { type :: Foreign } <- readImpl impl.arguments
        type_ <- readImpl args.type
        pure $ ArrayType { type: type_ }
      "url" -> UrlType <$> readImpl impl.arguments
      "object" -> do
        args :: { properties :: Array PropertyInfoImpl } <- readImpl impl.arguments
        let properties = map toPropertyInfo args.properties
        pure $ ObjectType { properties }
      "document" -> DocumentType <$> readImpl impl.arguments
      "enumeration" -> do
        args :: { enumerators :: Array EnumeratorImpl } <- readImpl impl.arguments
        pure $ EnumType { enumerators: map toEnumerator args.enumerators }
      "entity" -> EntityType <$> readImpl impl.arguments
      "image" -> ImageType <$> readImpl impl.arguments
      _ -> except $ Left $ NEL.singleton $ ForeignError ""

fromType :: Type -> TypeImpl
fromType = case _ of
  IntType args -> { name: "integer", arguments: writeImpl args }
  StringType args -> { name: "string", arguments: writeImpl args }
  BoolType args -> { name: "boolean", arguments: writeImpl args }
  TextType args -> { name: "text", arguments: writeImpl args }
  FormatType args -> { name: "format", arguments: writeImpl args }
  SpaceType args -> { name: "space", arguments: writeImpl args }
  ContentType args -> { name: "content", arguments: writeImpl args }
  CodeType args -> { name: "code", arguments: writeImpl { language: toNullable args.language } }
  ArrayType args -> { name: "array", arguments: writeImpl args }
  UrlType args -> { name: "url", arguments: writeImpl args }
  ObjectType args -> { name: "object", arguments: writeImpl { properties: map fromPropertyInfo args.properties } }
  DocumentType args -> { name: "document", arguments: writeImpl args }
  EnumType args -> { name: "enumeration", arguments: writeImpl { enumerators: map fromEnumerator args.enumerators } }
  EntityType args -> { name: "entity", arguments: writeImpl args }
  ImageType args -> { name: "image", arguments: writeImpl args }

fromEnumerator :: Enumerator -> EnumeratorImpl
fromEnumerator enum = enum { fieldName = toNullable enum.fieldName }

toEnumerator :: EnumeratorImpl -> Enumerator
toEnumerator enum = enum { fieldName = toMaybe enum.fieldName }

instance writeForeignType :: WriteForeign Type where
  writeImpl = writeImpl <<< fromType

getTypeName :: Type -> String
getTypeName ty = (fromType ty).name

type PropertyInfo
  = { id :: String
    , displayName :: String
    , fieldName :: Maybe String
    , type :: Type
    , semantic :: Maybe String
    , optional :: Boolean
    }

getDefaultValue :: Array PropertyInfo -> Json
getDefaultValue props = fromObject $ Object.fromFoldable $ map (\x-> Tuple x.id $ defaultValue x.type) props
  where
  defaultValue :: Type -> Json
  defaultValue = case _ of
    IntType args -> jsonNull
    StringType args -> jsonNull
    BoolType args -> jsonNull
    TextType args -> jsonNull
    FormatType args -> jsonNull
    SpaceType args -> jsonNull
    ContentType args -> jsonNull
    CodeType args -> jsonNull
    ArrayType args -> fromArray []
    UrlType args -> jsonNull
    ObjectType args -> getDefaultValue args.properties
    DocumentType args -> jsonNull
    EnumType args -> jsonNull
    EntityType args -> jsonNull
    ImageType args -> jsonNull

type PropertyInfoImpl
  = { id :: String
    , displayName :: String
    , fieldName :: Nullable String
    , type :: Foreign
    , semantic :: Nullable String
    , optional :: Boolean
    }

toPropertyInfo :: PropertyInfoImpl -> PropertyInfo
toPropertyInfo impl =
  { id: impl.id
  , displayName: impl.displayName
  , fieldName: toMaybe impl.fieldName
  , type: ty
  , semantic: toMaybe impl.semantic
  , optional: impl.optional
  }
  where
  tyE = readImpl impl.type :: F Type

  tyF = runExcept tyE

  ty = either (const $ IntType {}) identity tyF

fromPropertyInfo :: PropertyInfo -> PropertyInfoImpl
fromPropertyInfo src =
  { id: src.id
  , displayName: src.displayName
  , fieldName: toNullable src.fieldName
  , type: writeImpl src.type
  , semantic: toNullable src.semantic
  , optional: src.optional
  }

type Property
  = { value :: Json
    , info :: PropertyInfo
    }

encodeProperties :: Array Property -> Json
encodeProperties props = encodeJson $ Object.fromFoldable $ map toTuple props
  where
  toTuple prop = Tuple prop.info.id $ encodeJson prop.value

mkProperty :: Json -> PropertyInfo -> Property
mkProperty value prop = { value: value, info: prop }

mkProperties :: Json -> Array PropertyInfo -> Array Property
mkProperties json props = case decodeToMap json of
  Just values -> map (\x -> toContentProp x $ M.lookup x.id values) props
  Nothing -> map (\x -> toContentProp x Nothing) props
  where
  toContentProp :: PropertyInfo -> Maybe Json -> Property
  toContentProp info maybeJson = { value: fromMaybe jsonNull maybeJson, info: info }

data PropertyInfoItem
  = DisplayNameItem
  | FieldNameItem
  | TypeItem
  | SemanticItem
  | OrderItem
  | CreationItem
  | OptionalItem
  | DeletionItem

data ChangeType
  = MajorChange
  | MinorChange
  | NoneChange

derive instance eqChangeType :: Eq ChangeType

type PropertyInfoDiffrence
  = { item :: PropertyInfoItem
    , id :: String
    , name :: String
    , before :: Maybe String
    , after :: Maybe String
    , changeType :: ChangeType
    }

type PropertyInfosDiffrence
  = { diffs :: Array PropertyInfoDiffrence
    , changeType :: ChangeType
    }

difference :: Array PropertyInfo -> Array PropertyInfo -> PropertyInfosDiffrence
difference before after = { diffs: diffs, changeType: getChangeType diffs }
  where
  getChangeType :: Array PropertyInfoDiffrence -> ChangeType
  getChangeType props =
    if length props == 0 then
      NoneChange
    else
      if 0 < length (filter (\x -> x.changeType == MajorChange) props) then MajorChange else MinorChange

  diffs :: Array PropertyInfoDiffrence
  diffs = concat $ fromFoldable $ map (uncurry propDifference) $ values $ mergeFromArray (\(Tuple _ x) -> x.id) (\(Tuple _ x) -> x.id) (withIndex 1 before) (withIndex 1 after)

  withIndex :: forall a. Int -> Array a -> Array (Tuple Int a)
  withIndex start array = case uncons array of
    Just { head: head, tail: tail } -> cons (Tuple start head) $ withIndex (start + 1) tail
    Nothing -> []

  propDifference :: Maybe (Tuple Int PropertyInfo) -> Maybe (Tuple Int PropertyInfo) -> Array PropertyInfoDiffrence
  propDifference bf af = case bf, af of
    Just (Tuple bfIndex before), Just (Tuple afIndex after) ->
      concat
        $ map fromFoldable
            [ if before.displayName /= after.displayName then
                Just $ mkDiff DisplayNameItem MinorChange (Just before.displayName) (Just after.displayName)
              else
                Nothing
            , if before.fieldName /= after.fieldName then
                Just $ mkDiff FieldNameItem MinorChange before.fieldName after.fieldName
              else
                Nothing
            , case before.type, after.type of
                StringType _, EntityType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                EntityType _, StringType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                EntityType _, EntityType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                StringType _, TextType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                CodeType _, TextType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                UrlType _, StringType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                bfType, afType ->
                  if bfType /= afType then
                    Just $ mkDiff TypeItem MajorChange (Just "") (Just "")
                  else
                    Nothing
            , if before.semantic /= after.semantic then
                Just $ mkDiff SemanticItem MinorChange before.semantic after.semantic
              else
                Nothing
            , if before.optional /= after.optional then
                Just $ mkDiff OptionalItem MinorChange (Just $ show before.optional) (Just $ show after.optional)
              else
                Nothing
            , if bfIndex /= afIndex then
                Just $ mkDiff OrderItem MinorChange (Just $ show bfIndex) (Just $ show afIndex)
              else
                Nothing
            ]
      where
      mkDiff item changeType bb aa = { item, id: after.id, name: after.displayName, changeType, before: bb, after: aa }
    Just (Tuple bfIndex before), Nothing -> singleton { item: DeletionItem, id: before.id, name: before.displayName, changeType: MajorChange, before: Nothing, after: Nothing }
    Nothing, Just (Tuple afIndex after) -> singleton { item: CreationItem, id: after.id, name: after.displayName, changeType: MajorChange, before: Nothing, after: Nothing }
    Nothing, Nothing -> singleton { item: DeletionItem, id: "", name: "", changeType: MinorChange, before: Nothing, after: Nothing }
