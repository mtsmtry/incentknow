module Incentknow.Data.Content where

import Prelude

import Data.Argonaut.Core (Json, isArray, isBoolean, isNumber, isObject, isString, toArray, toString)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (catMaybes, concat, elem, filter, fromFoldable, head, mapWithIndex, range, singleton)
import Data.Either (Either)
import Data.Map (Map, toUnfoldable)
import Data.Map as M
import Data.Map.Utils (decodeToMap, mergeFromArray)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten, fromEither)
import Data.Newtype (unwrap, wrap)
import Data.Nullable (toMaybe)
import Data.Tuple (Tuple(..), fst, snd)
import Foreign.Object as F
import Incentknow.Api (Format)
import Incentknow.Data.Ids (ContentId, DraftId(..), FormatId, SemanticId(..), SpaceId, StructureId(..), UserId(..))
import Incentknow.Data.Property (PropertyInfo, Type(..), mkProperties, toPropertyInfo)

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
    flatten $
    map
    (\id-> head $ catMaybes $ map (\x -> if x.info.id == id then toString x.value else Nothing) props)
    (toMaybe format.semanticId)

  title = fromMaybe "" $ head $ catMaybes $ map (\x -> toString x.value) props
  image = head $ catMaybes $ map (\x -> if x.info.type == ImageType {} then toString x.value else Nothing) props

data ValidationError
  = WrongType String Type -- プロパティ名, 本来の型
  | LackedProperty String
  | ExtraProperty String
  | NotBeObject

validateProperty :: String -> Boolean -> Maybe Type -> Maybe Json -> Array ValidationError
validateProperty name optional maybeType maybeValue = case maybeType, maybeValue of
  Just type_, Nothing -> if optional then [] else singleton $ LackedProperty name
  Nothing, Just value -> singleton $ ExtraProperty name
  Just type_, Just value -> case type_ of
    EnumType args -> fromBool $ maybe false (flip elem fieldNames) $ toString value
      where
      fieldNames = catMaybes $ map (\x-> x.fieldName) args.enumerators
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

        validate i vl = validateProperty (name <> "[" <> show i <> "]") false (Just args.type) (Just vl)
      errors -> errors
    UrlType args -> fromBool $ isString value
    ObjectType args -> case fromBool $ isObject value of
      [] -> validateContentImpl (name <> ".") args.properties value
      errors -> errors
    DocumentType args -> fromBool $ isArray value
    ImageType args -> fromBool $ isString value
    where
    fromBool :: Boolean -> Array ValidationError
    fromBool src = if src then [] else singleton $ WrongType name type_
  Nothing, Nothing -> []

validateContentImpl :: String -> Array PropertyInfo -> Json -> Array ValidationError
validateContentImpl name props json = case decodeToMap json of
  Just jsonMap -> concat $ map validate pairs
    where
    validate :: Tuple String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json))) -> Array ValidationError
    validate (Tuple subName (Tuple prop vl)) =
      validateProperty (name <> subName)
        (fromMaybe false $ map (\x -> x.optional) prop)
        (map (\x -> x.type) prop)
        (map snd vl)

    pairs :: Array (Tuple String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json))))
    pairs = toUnfoldable pairMap

    jsonArray :: Array (Tuple String Json)
    jsonArray = toUnfoldable jsonMap

    pairMap :: Map String (Tuple (Maybe PropertyInfo) (Maybe (Tuple String Json)))
    pairMap = mergeFromArray (\x -> fromMaybe "" x.fieldName) fst props jsonArray
  Nothing -> [ NotBeObject ]

validateContent :: Array PropertyInfo -> Json -> Array ValidationError
validateContent = validateContentImpl ""
