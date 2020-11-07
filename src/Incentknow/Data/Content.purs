module Incentknow.Data.Content where

import Prelude

import Data.Argonaut.Core (Json, isArray, isBoolean, isNumber, isObject, isString, toArray, toString)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (catMaybes, concat, cons, elem, filter, foldr, fromFoldable, head, length, mapWithIndex, range, singleton, sortBy, tail)
import Data.Either (Either)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map, toUnfoldable)
import Data.Map as M
import Data.Map.Utils (decodeToMap, mergeFromArray)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten, fromEither)
import Data.Newtype (unwrap, wrap)
import Data.Nullable (null, toMaybe, toNullable)
import Data.String (joinWith)
import Data.Tuple (Tuple(..), fst, snd)
import Effect.Aff.Class (class MonadAff)
import Foreign.Object as F
import Incentknow.Data.Property (Type(..), PropertyInfo, mkProperties, toPropertyInfo)

type ContentSemanticData
  = { title :: String
    , semanticId :: Maybe SemanticId
    , image :: Maybe String
    }

getContentSemanticData :: Json -> Format -> ContentSemanticData
getContentSemanticData contentData format = { title, semanticId: map wrap semanticId, image }
  where
  props = mkProperties contentData $ map toPropertyInfo format.structure.properties

  semanticId =
    flatten
      $ map
          (\id -> head $ catMaybes $ map (\x -> if x.info.id == id then toString x.value else Nothing) props)
          (toMaybe format.semanticId)

  title = fromMaybe "" $ head $ catMaybes $ map (\x -> toString x.value) props

  image = head $ catMaybes $ map (\x -> if x.info.type == ImageType {} then toString x.value else Nothing) props

data ValidationError
  = WrongType String Type -- プロパティ名, 本来の型
  | LackedProperty String
  | ExtraProperty String
  | NotBeObject

validateProperty :: (PropertyInfo -> String) -> String -> Boolean -> Maybe Type -> Maybe Json -> Array ValidationError
validateProperty getKey name optional maybeType maybeValue = case maybeType, maybeValue of
  Just type_, Nothing -> if optional then [] else singleton $ LackedProperty name
  Nothing, Just value -> singleton $ ExtraProperty name
  Just type_, Just value -> case type_ of
    EnumType args -> fromBool $ maybe false (flip elem fieldNames) $ toString value
      where
      fieldNames = catMaybes $ map (\x -> x.fieldName) args.enumerators
    IntType args -> fromBool $ isNumber value
    BoolType args -> fromBool $ isBoolean value
    StringType args -> fromBool $ isString value
    TextType args -> fromBool $ isString value
    FormatType args -> fromBool $ isString value
    SpaceType args -> fromBool $ isString value
    ContentType args -> fromBool $ isString value
    EntityType args -> fromBool $ isString value
    CodeType args -> fromBool $ isString value
    ArrayType args -> case fromBool $ isArray value of
      [] -> concat $ mapWithIndex validate array
        where
        array = fromMaybe [] $ toArray value

        validate i vl = validateProperty getKey (name <> "[" <> show i <> "]") false (Just args.type) (Just vl)
      errors -> errors
    UrlType args -> fromBool $ isString value
    ObjectType args -> case fromBool $ isObject value of
      [] -> validateContentImpl getKey (name <> ".") args.properties value
      errors -> errors
    DocumentType args -> fromBool $ isArray value
    ImageType args -> fromBool $ isString value
    where
    fromBool :: Boolean -> Array ValidationError
    fromBool src = if src then [] else singleton $ WrongType name type_
  Nothing, Nothing -> []

validateContentImpl :: (PropertyInfo -> String) -> String -> Array PropertyInfo -> Json -> Array ValidationError
validateContentImpl getKey name props json = case decodeToMap json of
  Just jsonMap -> concat $ map validate pairs
    where
    validate :: Tuple String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json))) -> Array ValidationError
    validate (Tuple subName (Tuple prop vl)) =
      validateProperty getKey (name <> subName)
        (fromMaybe false $ map (\x -> x.optional) prop)
        (map (\x -> x.type) prop)
        (map snd vl)

    pairs :: Array (Tuple String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json))))
    pairs = toUnfoldable pairMap

    jsonArray :: Array (Tuple String Json)
    jsonArray = toUnfoldable jsonMap

    pairMap :: Map String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json)))
    pairMap = mergeFromArray getKey fst props jsonArray
  Nothing -> [ NotBeObject ]

validateContentObject :: Array PropertyInfo -> Json -> Array ValidationError
validateContentObject = validateContentImpl (\x -> fromMaybe "" x.fieldName) ""

validateContentData :: Array PropertyInfo -> Json -> Array ValidationError
validateContentData = validateContentImpl (\x -> x.id) ""

data FilterOperation a
  = Equal a
  | NotEqual a
  | In a -- a, array a
  | ArrayContains a -- array a, a
  | ArrayContainsAny a -- array a, array a
  | RangeOf (Maybe a) (Maybe a)

type ContentFilter
  = { propertyIds :: Array String
    , operation :: FilterOperation Json
    }

type ContentCondition
  = { filters :: Array ContentFilter
    , orderBy :: Maybe String
    }

type ContentQuery
  = { formatId :: FormatId
    , spaceId :: SpaceId
    , condition :: ContentCondition
    }

data ContentRelation
  = BySpace SpaceId
  | ByContainr SpaceId FormatId
  | ByContent Content

type ContentConditionMethod
  = { serverCondition :: FirestoreCondition
    , clientCondition :: FirestoreCondition
    }

--getContentQuery :: FormatId -> Array Format -> ContentQuery
--getContentQuery formatId relFormat = 0
--  where
--  getContentQuery :: String -> PropertyInfo -> Tuple String PropertyInfo
--  getContentQuery a = 0
data FilterType
  = UseData
  | UseSortIndex -- 複数のこのタイプの条件がある場合、複合インデックスが必要となる
  | UseFlatArrayIndex -- dataプロパティではなく、indexesプロパティを使用する

toContentQueryMethod :: ContentCondition -> ContentConditionMethod
toContentQueryMethod query =
  if length filters.otherFilters == 0 then
    let
      sortFiltersByFieldPath = getFiltersByFieldPath filters.sortFilters
    in
      if length sortFiltersByFieldPath == 0 then
        { serverCondition: { filters: [], orderBy: toNullable query.orderBy }
        , clientCondition: { filters: [], orderBy: null }
        }
      else
        let
          mostSortFiltersByFieldPath = fromMaybe [] $ head sortFiltersByFieldPath

          otherSortFiltersByFieldPath = concat $ fromMaybe [] $ tail sortFiltersByFieldPath
        in
          { serverCondition: { filters: mostSortFiltersByFieldPath, orderBy: null }
          , clientCondition: { filters: otherSortFiltersByFieldPath, orderBy: toNullable query.orderBy }
          }
  else
    { serverCondition: { filters: filters.otherFilters, orderBy: null }
    , clientCondition: { filters: filters.sortFilters, orderBy: toNullable query.orderBy }
    }
  where
  filters = toFirestoreFilters $ L.fromFoldable query.filters

  getFiltersByFieldPath :: Array FirestoreFilter -> Array (Array FirestoreFilter)
  getFiltersByFieldPath filters = sortBy compareLength $ map snd $ M.toUnfoldable $ getFieldPathMap filters
    where
    getFieldPathMap :: Array FirestoreFilter -> Map String (Array FirestoreFilter)
    getFieldPathMap = foldr (\w -> \m -> M.insertWith (<>) w.fieldPath [ w ] m) M.empty

    compareLength b a = compare (length a) (length b)

  toFirestoreFilters ::
    List ContentFilter ->
    { sortFilters :: Array FirestoreFilter
    , otherFilters :: Array FirestoreFilter
    }
  toFirestoreFilters = case _ of
    Cons head tail -> case toTypeAndFirestoreWhere head of
      Tuple UseSortIndex wh -> tailFilters { sortFilters = wh <> tailFilters.sortFilters }
      Tuple _ wh -> tailFilters { otherFilters = wh <> tailFilters.otherFilters }
      where
      tailFilters = toFirestoreFilters tail
    Nil -> { sortFilters: [], otherFilters: [] }

  toTypeAndFirestoreWhere :: ContentFilter -> Tuple FilterType (Array FirestoreFilter)
  toTypeAndFirestoreWhere filter =
    if usesSortIndex filter.operation then
      Tuple UseSortIndex $ toFirestoreWhere "data" filter
    else
      if length filter.propertyIds == 1 then
        Tuple UseData $ toFirestoreWhere "data" filter
      else
        Tuple UseFlatArrayIndex $ toFirestoreWhere "indexes" filter
    where
    usesSortIndex :: forall a. FilterOperation a -> Boolean
    usesSortIndex = case _ of
      RangeOf _ _ -> true
      _ -> false

  toFirestoreWhere :: String -> ContentFilter -> Array FirestoreFilter
  toFirestoreWhere rootPath filter = case filter.operation of
    Equal value -> singleton { fieldPath, opStr: "==", value }
    NotEqual value -> singleton { fieldPath, opStr: "!=", value }
    In value -> singleton { fieldPath, opStr: "in", value }
    ArrayContains value -> singleton { fieldPath, opStr: "array-contains", value }
    ArrayContainsAny value -> singleton { fieldPath, opStr: "array-contains-any", value }
    RangeOf min max ->
      catMaybes
        [ map (\value -> { fieldPath, opStr: "<=", value }) min
        , map (\value -> { fieldPath, opStr: ">=", value }) max
        ]
    where
    fieldPath = rootPath <> "." <> joinWith ":" filter.propertyIds