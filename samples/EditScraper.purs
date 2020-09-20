module Incentknow.Pages.EditScraper where

import Prelude
import Affjax (Error(..), printError)
import Affjax as AX
import Affjax.RequestBody as RequestBody
import Affjax.ResponseFormat as ResponseFormat
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, jsonNull, stringify, toArray, toObject, toString)
import Data.Argonaut.Decode (decodeJson, getField)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Array (catMaybes, concat, elem, filter, head)
import Data.Either (Either(..), either)
import Data.Foldable (for_, traverse_)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing)
import Data.Maybe.Utils (flatten, fromEither)
import Data.String (Pattern(..), split)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log, logShow)
import Foreign (readString)
import Foreign.Object (insert)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.EventSource (EventSource(..))
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (button, submitButton)
import Incentknow.Data.Ids (SpaceId(..), ContentId(..), FormatId(..))
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.SelectMenu (SelectMenuItem)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.TabMenu (tabMenu)
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Pages.Crawler.Console as Console
import Incentknow.Route (Route(..))
import JsonFormatter as JsonFormatter

type Input
  = { contentId :: ContentId }

type State
  = { contentId :: ContentId
    , data :: Maybe Content
    , value :: Json
    , sampleUrl :: Maybe String
    , tab :: Tab
    , outputOpen :: Boolean
    , running :: Boolean
    , testResponse :: Maybe (Either String String)
    , htmlCache :: Map String String
    , code :: String
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue Json
  | ChangeSampleUrl (Maybe String)
  | ChangeTab Tab
  | ChangeOutputOpen Boolean
  | ChangeCode String
  | RunTest
  | Revise

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( editor :: Editor.Slot Unit
    , sampleUrlMemu :: SelectMenu.Slot Unit
    , aceEditor :: AceEditor.Slot Unit
    , jsonFormatter :: JsonFormatter.Slot Unit
    , console :: Console.Slot Unit
    )

data Tab
  = DetailsTab
  | CodeTab

instance showEditScraperTab :: Show Tab where
  show = case _ of
    DetailsTab -> "Details"
    CodeTab -> "Code"

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { contentId: input.contentId
  , data: Nothing
  , value: jsonNull
  , sampleUrl: Nothing
  , tab: DetailsTab
  , outputOpen: true
  , running: false
  , testResponse: Nothing
  , htmlCache: Map.empty
  , code: ""
  }

editor_ = SProxy :: SProxy "editor"

samples_ = "samples"

code_ = "code"

getSamples :: Json -> Array String
getSamples value =
  fromMaybe []
    $ do
        obj <- toObject value
        field <- fromEither $ getField obj samples_
        array <- toArray field
        pure $ catMaybes $ map toString array

getCode :: Json -> Maybe String
getCode value = do
  obj <- toObject value
  field <- fromEither $ getField obj code_
  toString field

toSelectMenuItem :: String -> SelectMenuItem
toSelectMenuItem name =
  { id: name
  , name: name
  , searchWord: name
  , html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html = HH.div [ css "name" ] [ HH.text name ]

renderText :: forall m. String -> H.ComponentHTML Action ChildSlots m
renderText text = HH.div_ $ concat $ map renderLine lines
  where
  renderLine line = [ HH.text line, HH.br_ ]

  lines = split (Pattern "\n") text

dropProperties :: Array String -> Format -> Format
dropProperties propIds format = format { structure { data = filter (\x -> not $ elem x.id propIds) format.structure.data } }

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-edit-scraper" ]
    [ HH.div
        [ css "left-side" ]
        [ HH.div [ css "toolbar" ]
            [ HH.div [ css "url-menu" ]
                [ HH.slot (SProxy :: SProxy "sampleUrlMemu") unit SelectMenu.component
                    { items: map toSelectMenuItem $ getSamples state.value, value: state.sampleUrl }
                    (Just <<< ChangeSampleUrl)
                ]
            , HH.div [ css "run-button" ]
                [ submitButton { isDisabled: state.running, isLoading: state.running, loadingText: "実行中", onClick: RunTest, text: "実行" }
                ]
            ]
        , HH.div [ css "main" ]
            [ HH.div [ css "sample-frame" ]
                [ maybeElem state.sampleUrl \url ->
                    HH.iframe [ HP.src url ]
                ]
            , HH.div [ css "outputs" ]
                [ maybeElem state.testResponse \response ->
                    HH.div [ css "left" ]
                      [ HH.div [ css "main" ]
                          [ case response of
                              Right output ->
                                HH.slot (SProxy :: SProxy "jsonFormatter") unit JsonFormatter.component
                                  { value: either (const jsonNull) (\x -> x) $ jsonParser output }
                                  absurd
                              Left error -> renderText error
                          ]
                      ]
                , HH.div [ css "right" ]
                    [ HH.div [ css "main" ]
                        [ HH.slot (SProxy :: SProxy "console") unit Console.component
                            { value: flatten $ map fromEither state.testResponse, scraper: stringify state.value }
                            absurd
                        ]
                    ]
                ]
            ]
        ]
    , HH.div [ css "right-side" ]
        [ HH.div [ css "tabbar" ]
            [ tabMenu { currentTab: state.tab, onChangeTab: ChangeTab, tabs: [ DetailsTab, CodeTab ] }
            , submitButton
                { isDisabled: isNothing state.data
                , isLoading: false
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Revise
                }
            ]
        , HH.div [ css "main" ]
            [ case state.tab of
                DetailsTab ->
                  maybeElem state.data \x ->
                    HH.slot editor_ unit Editor.component { format: x.format, value: state.value } (Just <<< ChangeValue)
                CodeTab ->
                  HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component
                    { value: state.code, language: Just "python", variableHeight: false, readonly: false }
                    (Just <<< ChangeCode)
            ]
        ]
    ]

apiUrl = "https://pu9i17ddd3.execute-api.ap-northeast-1.amazonaws.com/default/python"

type FetchRequest
  = { code :: String
    , url :: String
    }

fetchHtml :: forall o m. MonadEffect m => MonadAff m => H.HalogenM State Action ChildSlots o m (Maybe String)
fetchHtml = do
  state <- H.get
  case state.sampleUrl of
    Just url -> case Map.lookup url state.htmlCache of
      Just cache -> pure $ Just cache
      Nothing -> do
        let
          url2 = url :: String

          body = encodeJson { code, url: url2 }
        result <- runPython body
        case result of
          Left _ -> pure Nothing
          Right html -> do
            H.modify_ \x -> x { htmlCache = Map.insert url html x.htmlCache }
            pure $ Just html
    Nothing -> pure Nothing
  where
  code =
    """
import requests
def main(src):
  response = requests.get(src["url"])
  response.encoding = "utf-8"
  return response.text
    """

type TestRequest
  = { code :: String
    , html :: String
    , scraper :: String
    }

mkTestRequest :: forall o m. MonadEffect m => MonadAff m => H.HalogenM State Action ChildSlots o m (Maybe TestRequest)
mkTestRequest = do
  maybeHtml <- fetchHtml
  case maybeHtml of
    Just html -> do
      state <- H.get
      pure $ Just { code, html, scraper: state.code }
    Nothing -> pure Nothing
  where
  code =
    """
import json
def main(src):
  exec(src["scraper"], globals())
  output = scrape(src["html"])
  return json.dumps(output)
    """

changeField :: String -> Json -> Json -> Json
changeField name field json =
  fromMaybe json
    $ do
        obj <- toObject json
        pure $ encodeJson $ insert name field obj

runPython :: forall m. MonadAff m => Json -> m (Either String String)
runPython requestBody = do
  result <- liftAff $ AX.post ResponseFormat.string apiUrl (Just (RequestBody.json requestBody))
  pure case result of
    Left (ResponseBodyError _ response) -> either (\x -> Left "") (\x -> Left x) $ runExcept $ readString response.body
    Left error -> Left $ printError error
    Right output -> Right output.body

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    client <- getClient
    handleError (client.contents.byId.get { params: { id: state.contentId } })
      >>= traverse_ \response -> do
          let
            value = either (const jsonNull) (\x -> x) $ jsonParser response.content.data
          H.modify_
            _
              { data = Just response { format = dropProperties [ code_ ] response.format }
              , code = fromMaybe "" $ getCode value
              , value = value
              , sampleUrl = head $ getSamples value
              }
  HandleInput input -> do
    state <- H.get
    when (state.contentId /= input.contentId) do
      H.modify_ _ { contentId = input.contentId }
      handleAction Initialize
  ChangeValue value -> H.modify_ _ { value = value }
  ChangeSampleUrl url -> H.modify_ _ { sampleUrl = url }
  ChangeTab tab -> H.modify_ _ { tab = tab }
  ChangeOutputOpen open -> H.modify_ _ { outputOpen = open }
  ChangeCode code -> H.modify_ _ { code = code }
  RunTest -> do
    -- H.modify_ _ { running = true }
    maybeRequest <- mkTestRequest
    for_ maybeRequest \request -> do
      result <- runPython (encodeJson request)
      H.modify_ _ { testResponse = Just result }
    H.modify_ _ { running = false }
  Revise -> do
    state <- H.get
    client <- getClient
    let
      value = changeField code_ (encodeJson state.code) state.value
    result <- handleError $ client.contents.byId.revise { params: { id: state.contentId }, body: stringify value }
    pure unit
