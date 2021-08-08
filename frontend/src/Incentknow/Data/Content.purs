module Incentknow.Data.Content where

import Prelude

import Data.Argonaut.Core (Json, isArray, isBoolean, isNull, isNumber, isObject, isString, toArray, toString)
import Data.Array (catMaybes, concat, elem, filter, head, mapWithIndex, singleton)
import Data.Map (Map, toUnfoldable)
import Data.Map.Utils (decodeToMap, mergeFromArray)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap, wrap)
import Data.Tuple (Tuple(..), fst, snd)
import Incentknow.Data.Entities (FocusedFormat, PropertyInfo, Type(..))
import Incentknow.Data.Ids (SemanticId)
import Incentknow.Data.Property (Property, mkProperties)

type ContentSemanticData
  = { title :: String
    , titleProperty :: Maybe { text :: String, info :: PropertyInfo }
    , semanticId :: Maybe SemanticId
    , image :: Maybe String
    }

getContentSemanticData :: Json -> FocusedFormat -> ContentSemanticData
getContentSemanticData contentData format = { title, semanticId: map wrap semanticId, titleProperty, image }
  where
  props = mkProperties contentData format.currentStructure.properties

  semanticId =
    flatten
      $ map
          (\id -> head $ catMaybes $ map (\x -> if unwrap x.info.id == id then toString x.value else Nothing) props)
          (format.semanticId)

  title = fromMaybe "" $ head $ catMaybes $ map (\x -> toString x.value) props

  image = head $ catMaybes $ map (\x -> if x.info.type == ImageType then toString x.value else Nothing) props

  titleProperty = map (\x-> { text: fromMaybe "" $ toString x.value, info: x.info }) $ head $ filter isString props
    where
    isString :: Property -> Boolean
    isString prop = case prop.info.type of
      StringType -> if isNull prop.value then false else true
      _ -> false

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
    EnumType enums -> fromBool $ maybe false (flip elem fieldNames) $ toString value
      where
      fieldNames = catMaybes $ map (\x -> x.fieldName) enums
    IntType -> fromBool $ isNumber value
    BoolType -> fromBool $ isBoolean value
    StringType -> fromBool $ isString value
    TextType -> fromBool $ isString value
    ContentType _ -> fromBool $ isString value
    EntityType _ -> fromBool $ isString value
    ArrayType subType -> case fromBool $ isArray value of
      [] -> concat $ mapWithIndex validate array
        where
        array = fromMaybe [] $ toArray value

        validate i vl = validateProperty getKey (name <> "[" <> show i <> "]") false (Just subType) (Just vl)
      errors -> errors
    UrlType -> fromBool $ isString value
    ObjectType props -> case fromBool $ isObject value of
      [] -> validateContentImpl getKey (name <> ".") props value
      errors -> errors
    DocumentType -> fromBool $ isArray value
    ImageType -> fromBool $ isString value
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
validateContentData = validateContentImpl (\x -> unwrap x.id) ""
