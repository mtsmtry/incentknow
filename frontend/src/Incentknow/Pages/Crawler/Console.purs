module Incentknow.Pages.Crawler.Console where

import Prelude

import Affjax.RequestBody (RequestBody(..), string)
import Data.Argonaut.Core (Json, stringify)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Array (length, mapWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.Maybe.Utils (flatten, fromEither)
import Data.Traversable (for, for_)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Console (logShow)
import Foreign.Object (Object)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Format, getFormat, getFormats)
import Incentknow.Api.Utils (Fetch, fetchApi, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Content (ValidationError(..), validateContent)
import Incentknow.Data.Ids (FormatId(..))
import Incentknow.Data.Property (getTypeName, toPropertyInfo)

type OutputIndex
  = { kind :: String, url :: String }

type OutputContent
  = { kind :: String, data :: Json }

type Output
  = { indexes :: Maybe (Array OutputIndex), contents :: Maybe (Array OutputContent) }

type ScraperOutputIndex
  = { kind :: String, url :: String }

type ScraperOutputContent
  = { kind :: String, format :: String }

type Scraper
  = { outputIndexes :: Array ScraperOutputIndex, outputContents :: Array ScraperOutputContent }

type Input
  = { value :: Maybe String, scraper :: String }

type State
  = { input :: Input, scraper :: Scraper, formats :: Map String Format, output :: Maybe Output, validationErrors :: Array (Array ValidationError) }

data Action
  = Initialize
  | Validate
  | HandleInput Input
  | FetchedFormat String (Fetch Format)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { input
  , scraper: decodeScraper input.scraper
  , formats: M.empty
  , output: flatten $ map decodeOutput input.value
  , validationErrors: []
  }
  where
  defaultScraper = { outputIndexes: [], outputContents: [] }

  decodeScraper str = fromMaybe defaultScraper $ flatten $ map (decodeJson >>> fromEither) $ fromEither $ jsonParser str

  decodeOutput str =  flatten $ map (decodeJson >>> fromEither) $ fromEither $ jsonParser str

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div []
    [ HH.div [] (mapWithIndex renderItem state.validationErrors)
    ]
  where
  renderItem :: Int -> Array ValidationError -> H.ComponentHTML Action ChildSlots m
  renderItem index errors =
    HH.div []
      [ HH.div [] [ HH.text $ show index ]
      , HH.div [] (map renderError errors)
      ]

  renderError :: ValidationError -> H.ComponentHTML Action ChildSlots m
  renderError error = HH.div [] [ HH.text $ toString error ]

  toString :: ValidationError -> String
  toString = case _ of
    WrongType field ty -> field <> "は" <> getTypeName ty <> "型である必要があります"
    LackedProperty field -> field <> "が足りません"
    ExtraProperty field -> field <> "は余分です"
    NotBeObject -> "オブジェクトである必要があります"

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.scraper.outputContents \x -> do
      fetchApi (FetchedFormat x.kind) $ getFormat $ FormatId x.format
  FetchedFormat kind fetch -> do
    state <- H.get
    forFetchItem fetch \format->
      H.modify_ \s-> s { formats = M.insert kind format s.formats }
    handleAction Validate
  Validate -> do
    state <- H.get
    for_ state.output \output -> do
      errors <-
        for (fromMaybe [] output.contents) \content -> do
          let
            maybeFormat = M.lookup content.kind state.formats
          liftEffect $ log "Console.maybeFormat"
          liftEffect $ logShow $ isNothing maybeFormat
          case maybeFormat of
            Just format -> do
              let errors = validateContent (map toPropertyInfo format.structure.properties) content.data
              liftEffect $ log "Console.errors.length"
              liftEffect $ logShow $ length errors
              pure errors
            Nothing -> pure []
      H.modify_ _ { validationErrors = errors }
  HandleInput input -> do
    state <- H.get
    liftEffect $ log "Console.HandleInput"
    liftEffect $ logShow $ stringify $ encodeJson state.output
    liftEffect $ logShow $ stringify $ encodeJson state.scraper.outputContents
    if input.scraper /= state.input.scraper then do
      H.put $ initialState input
      handleAction Initialize
    else if input.value /= state.input.value then do
      H.put (initialState input) { formats = state.formats }
      handleAction Validate
    else
      pure unit
