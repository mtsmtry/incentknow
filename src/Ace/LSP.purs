module LSP where

import Prelude
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import JsonRPC (notify, request)
import Web.Event.EventTarget as EET
import Web.Socket.Event.EventTypes as WSET
import Web.Socket.WebSocket as WS

type Connection
  = WS.WebSocket

type TextDocumentItem
  = { uri :: String
    , languageId :: String
    , text :: String
    , version :: Int
    }

type DidOpenTextDocumentParams  -- didOpen
  = { textDocument :: TextDocumentItem
    }

type VersionedTextDocumentIdentifier
  = { uri :: String
    , version :: Int
    }

type DidChangeTextDocumentParams  -- didChange
  = { textDocument :: VersionedTextDocumentIdentifier
    , contentChanges :: Array { text :: String }
    }

type Position
  = { line :: Int
    , character :: Int
    }

type TextDocumentPositionParams  -- hover
  = { textDocument :: { uri :: String }
    , position :: Position
    }

data CompletionTriggerKind
  = Invoked
  | TriggerCharacter
  | TriggerForIncompleteCompletions

type CompletionParams  -- completion
  = { textDocument :: { uri :: String }
    , position :: Position
    , context ::
        { triggerKind :: Int
        , triggerCharacter :: String
        }
    }

type CompletionItem
  = { detail :: String
    , documentation :: String
    , insertText :: String
    , kind :: Int
    , label :: String
    , sortText :: String
    }

type CompletionList
  = { isIncomplete :: Boolean
    , items :: Array CompletionItem
    }

didChange :: Connection -> DidChangeTextDocumentParams -> Effect Unit
didChange socket params = do
  let
    paramsJson = encodeJson params
  notify socket "textDocument/didChange" paramsJson

didOpen :: Connection -> DidOpenTextDocumentParams -> Effect Unit
didOpen socket params = do
  let
    paramsJson = encodeJson params
  notify socket "textDocument/didOpen" paramsJson

complete :: Connection -> CompletionParams -> (Maybe CompletionList -> Effect Unit) -> Effect Unit
complete socket params callback = do
  let
    paramsJson = encodeJson params
  request socket "textDocument/completion" paramsJson callback2
  where
  callback2 response = case response of
    Right resultJson -> case decodeJson resultJson of
      Right result -> callback $ Just result
      Left _ -> callback Nothing
    Left _ -> callback Nothing

createConnection :: forall m. MonadEffect m => m Connection
createConnection = do
  liftEffect $ WS.create "ws://localhost:3000/python" []

onOpen :: WS.WebSocket -> Effect Unit -> Effect Unit
onOpen socket callback = do
  listener <-
    EET.eventListener \ev -> callback
  EET.addEventListener
    WSET.onOpen
    listener
    false
    (WS.toEventTarget socket)

initialize :: Connection -> Effect Unit
initialize connection = case jsonParser initializetion of
  Right paramsJson -> notify connection "initialize" paramsJson
  Left _ -> pure unit
  where
  initializetion =
    """
    {
      "capabilities": {
          "textDocument": {
              "hover": {
                  "dynamicRegistration": true,
                  "contentFormat": [
                      "plaintext",
                      "markdown"
                  ]
              },
              "synchronization": {
                  "dynamicRegistration": true,
                  "willSave": false,
                  "didSave": false,
                  "willSaveWaitUntil": false
              },
              "completion": {
                  "dynamicRegistration": true,
                  "completionItem": {
                      "snippetSupport": false,
                      "commitCharactersSupport": true,
                      "documentationFormat": [
                          "plaintext",
                          "markdown"
                      ],
                      "deprecatedSupport": false,
                      "preselectSupport": false
                  },
                  "contextSupport": false
              },
              "signatureHelp": {
                  "dynamicRegistration": true,
                  "signatureInformation": {
                      "documentationFormat": [
                          "plaintext",
                          "markdown"
                      ]
                  }
              },
              "declaration": {
                  "dynamicRegistration": true,
                  "linkSupport": true
              },
              "definition": {
                  "dynamicRegistration": true,
                  "linkSupport": true
              },
              "typeDefinition": {
                  "dynamicRegistration": true,
                  "linkSupport": true
              },
              "implementation": {
                  "dynamicRegistration": true,
                  "linkSupport": true
              }
          },
          "workspace": {
              "didChangeConfiguration": {
                  "dynamicRegistration": true
              }
          }
      },
      "initializationOptions": null,
      "processId": null,
      "rootUri": "#rootPath#",
      "workspaceFolders": null
    }
    """
