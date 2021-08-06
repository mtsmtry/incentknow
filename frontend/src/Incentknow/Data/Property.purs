module Incentknow.Data.Property where

import Prelude

import Data.Argonaut.Core (Json, fromArray, fromObject, jsonNull)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (concat, cons, filter, fromFoldable, length, singleton, uncons)
import Data.Map (values)
import Data.Map as M
import Data.Map.Utils (decodeToMap, mergeFromArray)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (unwrap)
import Data.Nullable (Nullable, toMaybe, toNullable)
import Data.Tuple (Tuple(..), uncurry)
import Foreign.Object as Object
import Incentknow.Data.Entities (Type(..), PropertyInfo)

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
    
fromEnumerator :: Enumerator -> EnumeratorImpl
fromEnumerator enum = enum { fieldName = toNullable enum.fieldName }

toEnumerator :: EnumeratorImpl -> Enumerator
toEnumerator enum = enum { fieldName = toMaybe enum.fieldName }

getDefaultValue :: Array PropertyInfo -> Json
getDefaultValue props = fromObject $ Object.fromFoldable $ map (\x-> Tuple (unwrap x.id) $ defaultValue x.type) props
  where
  defaultValue :: Type -> Json
  defaultValue = case _ of
    IntType -> jsonNull
    StringType -> jsonNull
    BoolType -> jsonNull
    TextType -> jsonNull
    FormatType -> jsonNull
    SpaceType -> jsonNull
    ContentType _ -> jsonNull
    CodeType _ -> jsonNull
    ArrayType _ -> fromArray []
    UrlType -> jsonNull
    ObjectType props -> getDefaultValue props
    DocumentType -> jsonNull
    EnumType _ -> jsonNull
    EntityType _ -> jsonNull
    ImageType -> jsonNull

type Property
  = { value :: Json
    , info :: PropertyInfo
    }

encodeProperties :: Array Property -> Json
encodeProperties props = encodeJson $ Object.fromFoldable $ map toTuple props
  where
  toTuple prop = Tuple (unwrap prop.info.id) $ encodeJson prop.value

mkProperty :: Json -> PropertyInfo -> Property
mkProperty value prop = { value: value, info: prop }

mkProperties :: Json -> Array PropertyInfo -> Array Property
mkProperties json props = case decodeToMap json of
  Just values -> map (\x -> toContentProp x $ M.lookup (unwrap x.id) values) props
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
  diffs = concat $ fromFoldable $ map (uncurry propDifference) $ values $ mergeFromArray (\(Tuple _ x) -> unwrap x.id) (\(Tuple _ x) -> unwrap x.id) (withIndex 1 before) (withIndex 1 after)

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
                StringType, EntityType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                EntityType _, StringType -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                EntityType _, EntityType _ -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                StringType, TextType -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                CodeType _, TextType -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
                UrlType, StringType -> Just $ mkDiff TypeItem MinorChange (Just "") (Just "")
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
      mkDiff item changeType bb aa = { item, id: unwrap after.id, name: after.displayName, changeType, before: bb, after: aa }
    Just (Tuple bfIndex before), Nothing -> singleton { item: DeletionItem, id: unwrap before.id, name: before.displayName, changeType: MajorChange, before: Nothing, after: Nothing }
    Nothing, Just (Tuple afIndex after) -> singleton { item: CreationItem, id: unwrap after.id, name: after.displayName, changeType: MajorChange, before: Nothing, after: Nothing }
    Nothing, Nothing -> singleton { item: DeletionItem, id: "", name: "", changeType: MinorChange, before: Nothing, after: Nothing }

type PropertyComposition
  = { info :: Array Property
    , sections :: Array Property
    }

toPropertyComposition :: Array Property -> PropertyComposition
toPropertyComposition props = 
  { info: filter (not <<< isSection) props
  , sections: filter isSection props
  }
  where
  isSection :: Property -> Boolean
  isSection prop = case prop.info.type of
    DocumentType -> true
    _ -> false
