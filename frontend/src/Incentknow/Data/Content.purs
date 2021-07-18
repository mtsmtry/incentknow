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
import Incentknow.Data.Entities (Type(..), PropertyInfo, FocusedFormat)
import Incentknow.Data.Ids (SemanticId(..))
import Incentknow.Data.Property (mkProperties)

type ContentSemanticData
  = { title :: String
    , semanticId :: Maybe SemanticId
    , image :: Maybe String
    }

getContentSemanticData :: Json -> FocusedFormat -> ContentSemanticData
getContentSemanticData contentData format = { title, semanticId: map wrap semanticId, image }
  where
  props = mkProperties contentData format.currentStructure.properties

  semanticId =
    flatten
      $ map
          (\id -> head $ catMaybes $ map (\x -> if unwrap x.info.id == id then toString x.value else Nothing) props)
          (format.semanticId)

  title = fromMaybe "" $ head $ catMaybes $ map (\x -> toString x.value) props

  image = head $ catMaybes $ map (\x -> if x.info.type == ImageType then toString x.value else Nothing) props

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
    FormatType -> fromBool $ isString value
    SpaceType -> fromBool $ isString value
    ContentType _ -> fromBool $ isString value
    EntityType _ -> fromBool $ isString value
    CodeType _ -> fromBool $ isString value
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
