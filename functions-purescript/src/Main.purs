module Incentknow.Server where

import Prelude

import Data.Argonaut.Core (Json, toArray)
import Data.Array (catMaybes, foldr, singleton)
import Data.Array as A
import Data.Foldable (all)
import Data.Int (fromString)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map, union, unionWith)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set.NonEmpty as S
import Data.String (drop, length)
import Data.String.Utils (startsWith)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Foreign (Foreign)
import Foreign.Object (Object)
import Foreign.Object as Object
import Incentknow.Data.Content (ValidationError(..), validateContent)
import Incentknow.Data.Ids (ContentId(..), FormatId(..))
import Incentknow.Data.Property (ChangeType(..), Property, PropertyInfo, PropertyInfoImpl, Type(..), difference, fromPropertyInfo, getTypeName, mkProperties, mkProperty, toPropertyInfo)

main :: Effect Unit
main = pure unit

getStructureChangeType :: { before :: Array PropertyInfoImpl, after :: Array PropertyInfoImpl } -> String
getStructureChangeType args = case info.changeType of
  MajorChange -> "major"
  MinorChange -> "minor"
  NoneChange -> "nonr"
  where
  info = difference (map toPropertyInfo args.before) (map toPropertyInfo args.after)

toJsonFromValidationError :: ValidationError -> String
toJsonFromValidationError = case _ of
  WrongType prop ty -> "プロパティ'" <> prop <> "'が" <> getTypeName ty <> "型ではありません"
  LackedProperty prop -> "プロパティ'" <> prop <> "'が不足しています"
  ExtraProperty prop -> "プロパティ'" <> prop <> "'は必要ありません"
  NotBeObject -> "オブジェクトではありません"

validateContentObject :: { props :: Array PropertyInfoImpl, data :: Json } -> Array String
validateContentObject args = map toJsonFromValidationError $ validateContent (map toPropertyInfo args.props) args.data

-- maxLargeIndex以下のLargeIndexは作成されない
normalizeStructure :: Array PropertyInfoImpl -> Array PropertyInfoImpl
normalizeStructure props =
  map fromPropertyInfo $ A.fromFoldable
    $ normalizeStructureImpl (getMaxLargeIndex props) (L.fromFoldable properties)
  where
  properties :: Array PropertyInfo
  properties = map toPropertyInfo props

  isLargeType :: Type -> Boolean
  isLargeType = case _ of
    TextType _ -> true
    CodeType _ -> true
    DocumentType _ -> true
    ArrayType args2 -> isLargeType args2.type
    ObjectType args2 -> all (\x -> isLargeType x.type) args2.properties
    _ -> false

  isLargeId :: String -> Boolean
  isLargeId id = startsWith id "large"

  getMaxLargeIndex :: Array PropertyInfoImpl -> Int
  getMaxLargeIndex props2 = fromMaybe 0 $ map (_ + 1) $ map S.max $ S.fromFoldable $ catMaybes $ map getLargeId props2
    where
    getLargeId :: PropertyInfoImpl -> Maybe Int
    getLargeId prop =
      if isLargeId prop.id then
        fromString $ drop (length "large") prop.id
      else
        Nothing

  normalizeStructureImpl :: Int -> List PropertyInfo -> List PropertyInfo
  normalizeStructureImpl largeIndex = case _ of
    Cons head tail ->
      if isLargeType head.type && (not $ isLargeId head.id) then
        Cons (head { id = "large" <> show largeIndex  }) $ normalizeStructureImpl (largeIndex + 1) tail
      else
        Cons head $ normalizeStructureImpl largeIndex tail
    Nil -> Nil

getStructureRelations :: Array PropertyInfoImpl -> Array FormatId
getStructureRelations props = getStructureRelationsImpl $ L.fromFoldable $ map toPropertyInfo props
  where
  getPropertyRelation :: Type -> Array FormatId
  getPropertyRelation = case _ of
    ContentType args -> singleton args.format
    ArrayType args -> getPropertyRelation args.type
    ObjectType args -> getStructureRelationsImpl $ L.fromFoldable args.properties
    _ -> []

  getStructureRelationsImpl :: List PropertyInfo -> Array FormatId
  getStructureRelationsImpl = case _ of
    Cons head tail -> getPropertyRelation head.type <> getStructureRelationsImpl tail
    Nil -> []

-- input : { sections: [{ theme: "A", document: {...}, cats: ["a1", "a2", "a3"] }, { theme: "B", document: {...}, cats: ["b1", "b2", "b3"] }] }
-- output: { sections_theme: ["A", "B"], sections_cats: ["a1", "a2", "a3", "b1", "b2", "b3"] }

getContentIndexes :: { props :: Array PropertyInfoImpl, data :: Json } -> Object (Array Json)
getContentIndexes args = Object.fromFoldable array_
  where
  array_ :: Array (Tuple String (Array Json))
  array_ = M.toUnfoldable $ getValuesFiltered $ mkProperties args.data (map toPropertyInfo args.props)

  getValuesFiltered :: Array Property -> Map String (Array Json)
  getValuesFiltered props = foldr M.union M.empty $ map getValueFiltered props

  getValueFiltered :: Property -> Map String (Array Json)
  getValueFiltered prop = case prop.info.type of
    ArrayType args_ ->
      case args_.type of
        ObjectType _ -> getValue prop
        _ -> M.empty
    _ -> M.empty

  addId :: String -> Array (Tuple String (Array Json)) -> Array (Tuple String (Array Json))
  addId id dict = map (\(Tuple key value)-> Tuple (if key == "" then id else id <> ":" <> key) value) dict

  getValue :: Property -> Map String (Array Json)
  getValue prop = M.fromFoldable $ addId prop.info.id array
    where
    array :: Array (Tuple String (Array Json))
    array = M.toUnfoldable $ getValueImpl prop.value prop.info.type

  getValueImpl :: Json -> Type -> Map String (Array Json)
  getValueImpl value = case _ of
    IntType _ -> single
    BoolType _ -> single
    StringType _ -> single
    FormatType _ -> single
    SpaceType _ -> single
    ContentType _ -> single
    UrlType _ -> single
    EnumType _ -> single
    EntityType _ -> single
    ImageType _ -> single
    TextType _ -> M.empty
    CodeType _ -> M.empty
    DocumentType _ -> M.empty
    ObjectType args_ -> foldr M.union M.empty $ map getValue $ mkProperties value args_.properties
    ArrayType args_ -> foldr mergeByJoin M.empty $ map (\vl-> getValueImpl vl args_.type) array
      where
      array = fromMaybe [] $ toArray value

      mergeByJoin :: Map String (Array Json) -> Map String (Array Json) -> Map String (Array Json)
      mergeByJoin = unionWith (\a-> \b-> a <> b)
    where
    single = M.singleton "" $ singleton value