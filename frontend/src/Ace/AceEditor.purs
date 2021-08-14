module Incentknow.Molecules.AceEditor where

import Prelude

import Ace (Completion, EditSession, Position(..), getColumn, getRow)
import Ace as Ace
import Ace.Completer (setCompleters)
import Ace.EditSession as Session
import Ace.Editor as Editor
import Ace.Ext.LanguageTools.Completer (CompleterCallback, mkCompleter)
import Ace.Types (Editor)
import Data.Foldable (for_, traverse_)
import Data.Function.Uncurried (Fn2, runFn2)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Global (infinity)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.EventSource as ES
import Incentknow.Data.Entities (Language(..))
import Incentknow.HTML.Utils (css)
import LSP (CompletionItem, Connection, complete, createConnection, didChange, didOpen, initialize, onOpen)

type Slot p
  = forall q. H.Slot q Output p

type Output
  = String

type Input
  = { value :: String, language :: Maybe Language, variableHeight :: Boolean, readonly :: Boolean }

toAceLang :: Language -> String
toAceLang = case _ of
  Python -> "python"
  Javascript -> "javascript"

data Action
  = Initialize
  | Finalize
  | HandleChange
  | HandleInput Input

-- | The state for the ace component - we only need a reference to the editor,
-- | as Ace editor has its own internal state that we can query instead of
-- | replicating it within Halogen.
type State
  = { text :: String
    , language :: Maybe Language
    , editor :: Maybe Editor
    , connection :: Maybe Connection
    , variableHeight :: Boolean
    , readonly :: Boolean
    }

-- | The Ace component definition.
component :: forall q m. MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , initialize = Just Initialize
            , finalize = Just Finalize
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { text: input.value
  , editor: Nothing
  , connection: Nothing
  , variableHeight: input.variableHeight
  , readonly: input.readonly
  , language: input.language
  }

-- As we're embedding a 3rd party component we only need to create a placeholder
-- div here and attach the ref property which will let us reference the element
-- in eval.
render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.div
    [ HP.ref (H.RefLabel "ace")
    , css (if state.variableHeight then "" else "ace_editor-variable-height")
    ]
    []

completer :: Connection -> Editor -> EditSession -> Position -> String -> CompleterCallback -> Effect Unit
completer connection editor session (Position pos) prefix callback = do
  complete connection
    { textDocument: { uri: "main" }
    , position: { line: pos.row, character: pos.column }
    , context:
        { triggerKind: 2
        , triggerCharacter: prefix
        }
    }
    (callback <<< map (map convert <<< _.items))
  where
  convert :: CompletionItem -> Completion
  convert item =
    { value: item.insertText
    , score: 0.0
    , meta: item.label
    , caption: Just item.documentation
    }

foreign import setCursorVisibleImpl
  :: Fn2 Editor Boolean (Effect Unit)

setCursorVisible
  :: Editor -> Boolean -> Effect Unit
setCursorVisible editor visible = runFn2 setCursorVisibleImpl editor visible

setupEditor :: forall m. MonadEffect m => MonadAff m => H.HalogenM State Action () Output m Unit
setupEditor = do
  state <- H.get
  for_ state.editor \editor -> do
    when state.variableHeight do
      H.liftEffect $ Editor.setMaxLines infinity editor
    H.liftEffect $ Editor.setReadOnly state.readonly editor
    H.liftEffect $ Editor.setHighlightActiveLine (not state.readonly) editor
    H.liftEffect $ Editor.setHighlightGutterLine (not state.readonly) editor
    void $ H.liftEffect $ Editor.setValue state.text (Just $ -1) editor
    H.liftEffect $ setCursorVisible editor (not state.readonly)

handleAction :: forall m. MonadEffect m => MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction = case _ of
  Initialize -> do
    H.getHTMLElementRef (H.RefLabel "ace")
      >>= traverse_ \element -> do
          state <- H.get
          -- create editor
          editor <- H.liftEffect $ Ace.editNode element Ace.ace
          session <- H.liftEffect $ Editor.getSession editor
          H.modify_ (_ { editor = Just editor })
          setupEditor
          -- change event
          void $ H.subscribe
            $ ES.effectEventSource \emitter -> do
                Session.onChange session (\_ -> ES.emit emitter HandleChange)
                pure mempty
          -- setup lsp
          for_ state.language \lang -> do
            liftEffect $ Session.setMode ("ace/mode/" <> toAceLang lang) session
            when (not state.readonly) do
              -- lcp
              connection <- createConnection
              H.modify_ (_ { connection = Just connection })
              let
                open = do
                  initialize connection
                  didOpen connection
                    { textDocument:
                        { uri: "main"
                        , languageId: "python"
                        , text: state.text
                        , version: 0
                        }
                    }
              liftEffect $ onOpen connection open
              comp <- H.liftEffect $ mkCompleter $ completer connection
              H.liftEffect $ setCompleters [ comp ] editor
  Finalize -> do
    -- Release the reference to the editor and do any other cleanup that a
    -- real world component might need.
    H.modify_ (_ { editor = Nothing })
  HandleChange -> do
    state <- H.get
    for_ state.editor \editor -> do
      text <- H.liftEffect $ Editor.getValue editor
      when (text /= state.text) do
        H.modify_ _ { text = text }
        H.raise text
        H.gets _.connection
          >>= traverse_ \connection -> do
              liftEffect
                $ didChange connection
                    { textDocument: { uri: "main", version: 0 }
                    , contentChanges: [ { text: text } ]
                    }

  HandleInput input -> do
    state <- H.get
    when (input.value /= state.text) do
      H.modify_ _ { text = input.value }
      for_ state.editor \editor-> do
        pos <- H.liftEffect $ Editor.getCursorPosition editor
        setupEditor
        H.liftEffect $ Editor.moveCursorTo (getRow pos) (Just $ getColumn pos) Nothing editor