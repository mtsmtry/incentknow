module Incentknow.Data.Page where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromObject, fromString, toObject, toString)
import Data.Either (either)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(..))
import Foreign (Foreign, F)
import Foreign.Object as FO
import Incentknow.Data.Ids (FormatId(..))
import Simple.JSON (class ReadForeign, readImpl, writeImpl)

type ContentRelation
  = { formatId :: FormatId
    , displayName :: String
    , property :: String
    }

type ContentPage
  = { relations :: Array ContentRelation
    }

type ContentCompositionImpl
  = { type :: String
    , details :: Foreign
    }

type CollectionPage
  = { compositions :: Array ContentCompositionImpl
    }

type Outliner
  = { parentProperties :: Map FormatId String
    }

type OutlinerImpl
  = { parentProperties :: Foreign
    }

data ContentComposition
  = CompositionBoard
  | CompositionTimeline
  | CompositionGallery
  | CompositionList
  | CompositionTable
  | CompositionOutliner Outliner

readForeign :: forall a. ReadForeign a => Foreign -> a
readForeign src = impl
  where
  implF = runExcept (readImpl src :: F a)
  impl = either (const dammyValue) identity implF

toOutliner :: OutlinerImpl -> Outliner
toOutliner impl = { parentProperties }
  where
  tuples = fromMaybe [] $ map FO.toUnfoldable $ toObject $ toJson impl.parentProperties :: Array (Tuple String Json)
  formatIdTuples = map (\(Tuple key value)-> Tuple (FormatId key) value) tuples
  formatMap = M.fromFoldable formatIdTuples :: Map FormatId Json
  parentProperties = map (fromMaybe "" <<< toString) formatMap

toOutlinerImpl :: Outliner -> OutlinerImpl
toOutlinerImpl outliner = { parentProperties }
  where
  parentProperties = toForeign
    $ fromObject 
    $ FO.fromFoldable 
    $ map (\(Tuple key value)-> Tuple (unwrap key) (fromString value)) tuples
  tuples = M.toUnfoldable outliner.parentProperties :: Array (Tuple FormatId String)

foreign import toJson :: Foreign -> Json

foreign import toForeign :: Json -> Foreign

foreign import dammyValue :: forall a. a

toContentComposition :: ContentCompositionImpl -> ContentComposition
toContentComposition impl =
  case impl.type of
    "outliner" -> CompositionOutliner $ toOutliner (readForeign impl.details :: OutlinerImpl)
    "timeline" -> CompositionTimeline
    "board" -> CompositionBoard
    "list" -> CompositionList
    _ -> dammyValue

fromContentComposition :: ContentComposition -> ContentCompositionImpl
fromContentComposition = case _ of
  CompositionOutliner outliner -> { type: "outliner", details: writeImpl $ toOutlinerImpl outliner }
  CompositionList -> { type: "list", details: writeImpl {} }
  _ -> dammyValue