module Incentknow.Organisms.Document.Editor where

import Prelude

import Data.Array (catMaybes, concat, findIndex, head, index, last, length, mapWithIndex, replicate, tail)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap, wrap)
import Data.String (Pattern(..), split)
import Data.String as S
import Data.String.CodeUnits (charAt, drop, fromCharArray, splitAt, take)
import Data.Symbol (SProxy(..))
import Data.Traversable (for_, sequence)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (RefLabel(..), getHTMLElementRef)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (BlockData(..), BlockType(..), Document, DocumentBlock)
import Incentknow.Data.EntityUtils (buildBlockData, defaultBlockDataOptions, getBlockDataOptions, getBlockType)
import Incentknow.Data.Ids (DocumentBlockId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Document.BlockEditor as Block
import Test.Unit.Console (consoleLog)
import Web.Clipboard.ClipboardEvent (ClipboardEvent)
import Web.Clipboard.ClipboardEvent as C
import Web.Event.Event (preventDefault)
import Web.HTML (HTMLElement)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, isComposing, toEvent)

type Input
  = { value :: Document }

type State
  = { document :: Document, composition :: Boolean }

data Action
  = Initialize
  | HandleInput Input
  | OnKeyDown KeyboardEvent
  | OnKeyUp KeyboardEvent
  | OnPase ClipboardEvent

type Slot p
  = forall q. H.Slot q Output p

type Output
  = Document

type ChildSlots
  = ( block :: Block.Slot DocumentBlockId )

type Selection
  = { startBlockId :: String
    , startOffset :: Int 
    , endBlockId :: String
    , endOffset :: Int 
    }

foreign import getSelection :: Effect Selection

foreign import _setCaret :: HTMLElement -> String -> Int -> Effect Unit

foreign import getBlockText :: HTMLElement -> String -> Effect String

foreign import targetValue :: ClipboardEvent -> String

setCaret :: HTMLElement -> DocumentBlockId -> Int -> Effect Unit
setCaret blocksElement blockId offset = _setCaret blocksElement (unwrap blockId) offset

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
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
  { document: 
      if length input.value.blocks == 0 then
        { blocks: [{ id: wrap "1", data: ParagraphBlockData "text" }] }
      else
        input.value
  , composition: false
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-document" ]
    [ HH.div 
        [ css "blocks"            
        , HH.attr (HH.AttrName "contenteditable") "true"
        , HE.onKeyDown $ Just <<< OnKeyDown
        , HE.onKeyUp $ Just <<< OnKeyUp
        , HE.onPaste $ Just <<< OnPase
        , HP.ref $ RefLabel "blocks"
        , HP.spellcheck false
        ]
        (map renderBlock state.document.blocks)
    ]
  where
  renderBlock :: DocumentBlock -> H.ComponentHTML Action ChildSlots m
  renderBlock block = HH.slot (SProxy :: SProxy "block") block.id Block.component { value: block } (\_-> Nothing)

genId :: Effect DocumentBlockId
genId = do
  randoms <- sequence $ replicate 12 $ randomInt 0 (S.length text - 1)
  pure $ wrap $ fromCharArray $ catMaybes $ map (\x-> charAt x text) randoms
  where
  text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  OnPase event -> do
    H.liftEffect $ preventDefault $ C.toEvent event
    selection <- H.liftEffect getSelection
    removeSelection selection false
    let lines = split (Pattern "\n") $ targetValue event
    if length lines == 1 then do
      -- insert text
      state <- H.get
      let
        text = fromMaybe "" $ head lines
        index = getBlockIndex (wrap selection.startBlockId) state.document.blocks
        change = changeByIndex (editText (\x-> let y = splitAt selection.startOffset x in y.before <> text <> y.after)) index
        blocks = change state.document.blocks
      H.modify_ _ { document = { blocks } }
      -- set caret
      maybeElement <- getHTMLElementRef $ RefLabel "blocks"
      for_ maybeElement \element-> do
        H.liftEffect $ setCaret element (wrap selection.startBlockId) (selection.startOffset + S.length text)
    else do
      -- insert lines
      state <- H.get
      let
        text = fromMaybe "" $ head lines
        newLines = fromMaybe [] $ tail lines
      newLineDatas <- H.liftEffect $ sequence $ map (\text-> map (\id-> { id, text }) genId) newLines
      let
        index = getBlockIndex (wrap selection.startBlockId) state.document.blocks
        endText = getBlockTextFromBlocks index state.document.blocks
        endTextAfter = (splitAt selection.startOffset endText).after
        change1 = changeByIndex (editText (\x-> let y = splitAt selection.startOffset x in y.before <> text)) index
        toBlockData i line = 
          if i == length newLineDatas - 1 then 
            { id: line.id, data: ParagraphBlockData $ line.text <> endTextAfter } 
          else 
            { id: line.id, data: ParagraphBlockData line.text }
        newBlocks = mapWithIndex toBlockData newLineDatas
        change2 = concat <<< map (\x-> if x.id == wrap selection.startBlockId then [x] <> newBlocks else [x])
        blocks = change2 $ change1 state.document.blocks
      H.modify_ _ { document = { blocks } }
      -- set caret
      maybeElement <- getHTMLElementRef $ RefLabel "blocks"
      for_ maybeElement \element-> do
        for_ (last newLineDatas) \lastLine->
          H.liftEffect $ setCaret element lastLine.id (S.length lastLine.text)
    -- raise
    state2 <- H.get
    H.raise state2.document
  OnKeyDown event -> do
    state <- H.get
    when (not $ isComposing event) do
      case code event of
        "Enter"-> do
          H.liftEffect $ consoleLog "EnterProcess"
          -- cancel event
          H.liftEffect $ preventDefault $ toEvent event
          -- get selection
          selection <- H.liftEffect getSelection
          -- delete selection
          removeSelection selection true

          if selection.startBlockId /= selection.endBlockId then do
            -- set caret
            maybeElement <- getHTMLElementRef $ RefLabel "blocks"
            for_ maybeElement \element->
              H.liftEffect $ setCaret element (wrap selection.endBlockId) 0
          else do
            -- insert new block
            state2 <- H.get
            newId <- H.liftEffect genId
            let
              endIndex = getBlockIndex (wrap selection.endBlockId) state2.document.blocks
              endText = getBlockTextFromBlocks endIndex state2.document.blocks
              endTextAfter = (splitAt selection.startOffset endText).after
              newBlock = { id: newId, data: ParagraphBlockData endTextAfter }
              change1 = changeByIndex (editText (\x-> (splitAt selection.startOffset x).before)) endIndex
              change2 = concat <<< map (\x-> if x.id == wrap selection.endBlockId then [x, newBlock] else [x])
            H.modify_ _ { document = { blocks: change2 $ change1 state2.document.blocks } }
            -- set caret
            maybeElement <- getHTMLElementRef $ RefLabel "blocks"
            for_ maybeElement \element-> do
              H.liftEffect $ setCaret element newId 0
          -- raise
          state3 <- H.get
          H.raise state3.document
        "Space" -> do
          -- cancel event 
          H.liftEffect $ preventDefault $ toEvent event
          -- remove selection
          selection <- H.liftEffect getSelection
          removeSelection selection false
          -- insert space
          state2 <- H.get
          let
            index = getBlockIndex (wrap selection.startBlockId) state.document.blocks
            change = changeByIndex (editText (\x-> let y = splitAt selection.startOffset x in y.before <> " " <> y.after)) index
            blocks = change state2.document.blocks
          H.modify_ _ { document = { blocks } }
          -- set caret
          maybeElement <- getHTMLElementRef $ RefLabel "blocks"
          for_ maybeElement \element-> do
            H.liftEffect $ setCaret element (wrap selection.startBlockId) (selection.startOffset + 1)
          -- raise
          state3 <- H.get
          H.raise state3.document
          
        "Backspace" -> do
          -- cancel event
          H.liftEffect $ preventDefault $ toEvent event
          -- remove selection
          selection <- H.liftEffect getSelection
          if selection.startBlockId == selection.endBlockId && selection.startOffset == selection.endOffset then
            if selection.startOffset == 0 then do
              -- remove block
              let
                i = getBlockIndex (wrap selection.startBlockId) state.document.blocks
                cusorBlockText = getBlockTextFromBlocks (i - 1) state.document.blocks
                deleteBlockText = getBlockTextFromBlocks i state.document.blocks
                change1 = changeByIndex (editText (\x-> x <> deleteBlockText)) (i - 1)
                change2 = removeBetween i i
                blocks = change2 $ change1 state.document.blocks
                maybeCursorBlock = index blocks (i - 1)
              when (i > 0) do
                -- change
                H.modify_ _ { document = { blocks } }
                -- set caret
                for_ maybeCursorBlock \cursorBlock-> do
                  maybeElement <- getHTMLElementRef $ RefLabel "blocks"
                  for_ maybeElement \element-> do
                    H.liftEffect $ setCaret element cursorBlock.id (S.length cusorBlockText)
            else do
              -- remove char
              let
                index = getBlockIndex (wrap selection.startBlockId) state.document.blocks
                change = changeByIndex (editText (\x-> take (selection.startOffset -1 ) x <> drop selection.startOffset x)) index
                blocks = change state.document.blocks
              H.modify_ _ { document = { blocks } }
              -- set caret
              maybeElement <- getHTMLElementRef $ RefLabel "blocks"
              for_ maybeElement \element-> do
                H.liftEffect $ setCaret element (wrap selection.startBlockId) (selection.startOffset - 1)
          else do
            -- remove selection
            removeSelection selection false
            -- caret
            maybeElement <- getHTMLElementRef $ RefLabel "blocks"
            for_ maybeElement \element-> do
              H.liftEffect $ setCaret element (wrap selection.startBlockId) selection.startOffset
          -- raise
          state2 <- H.get
          H.raise state2.document
        _ -> pure unit
  OnKeyUp event -> do
    state <- H.get
    case code event of
      _ -> do
        selection <- H.liftEffect getSelection
        maybeElement <- getHTMLElementRef $ RefLabel "blocks"
        for_ maybeElement \element-> do
          text <- H.liftEffect $ getBlockText element selection.startBlockId
          let
            index = getBlockIndex (wrap selection.startBlockId) state.document.blocks

            change :: Array DocumentBlock -> Array DocumentBlock
            change = changeByIndex (editData normalizeBlockData <<< editText (\_-> text)) index

            blocks = change state.document.blocks
            document = { blocks }
          H.modify_ _ { document = document }
          H.raise document
  where
  removeSelection :: Selection -> Boolean -> H.HalogenM State Action ChildSlots Output m Unit
  removeSelection selection isEnter = do
    state <- H.get
    if selection.startBlockId /= selection.endBlockId then 
      if isEnter then do
        let
          startIndex = getBlockIndex (wrap selection.startBlockId) state.document.blocks
          endIndex = getBlockIndex (wrap selection.endBlockId) state.document.blocks
          change1 = changeByIndex (editText (\x-> (splitAt selection.startOffset x).before)) startIndex
          change2 = changeByIndex (editText (\x-> (splitAt selection.endOffset x).after)) endIndex
          change3 = removeBetween (startIndex + 1) (endIndex - 1)
          blocks = change3 $ change2 $ change1 state.document.blocks
        H.modify_ _ { document = { blocks } }
      else do
        let
          startIndex = getBlockIndex (wrap selection.startBlockId) state.document.blocks
          endIndex = getBlockIndex (wrap selection.endBlockId) state.document.blocks
          endText = (splitAt selection.endOffset $ getBlockTextFromBlocks endIndex state.document.blocks).after
          change1 = changeByIndex (editText (\x-> (splitAt selection.startOffset x).before <> endText)) startIndex
          change2 = removeBetween (startIndex + 1) endIndex
          blocks = change2 $ change1 state.document.blocks
        H.modify_ _ { document = { blocks } }
    else if selection.startOffset /= selection.endOffset then do
      let
        index = getBlockIndex (wrap selection.startBlockId) state.document.blocks
        change = changeByIndex (editText (\x-> (splitAt selection.startOffset x).before <> (splitAt selection.endOffset x).after)) index
        blocks = change state.document.blocks
      H.modify_ _ { document = { blocks } }
    else
      pure unit

  getBlockIndex :: DocumentBlockId -> Array DocumentBlock -> Int
  getBlockIndex id blocks = fromMaybe (-1) $ findIndex (\x-> x.id == id) blocks

  getBlockTextFromBlocks :: Int -> Array DocumentBlock -> String
  getBlockTextFromBlocks i blocks = fromMaybe "" $ flatten $ map (\x-> (getBlockDataOptions x.data).text) $ index blocks i

  changeByIndex :: forall a. (a -> a) -> Int -> Array a -> Array a
  changeByIndex change index = mapWithIndex (\i-> \x-> if i == index then change x else x)

  editData :: (BlockData -> BlockData) -> DocumentBlock -> DocumentBlock
  editData changeData block = { id: block.id, data: changeData block.data }

  editText :: (String -> String) -> DocumentBlock -> DocumentBlock
  editText changeText block = { id: block.id, data: editDataText changeText block.data }

  editDataText :: (String -> String) -> BlockData -> BlockData
  editDataText changeText block = fromMaybe default $ buildBlockData ty $ options { text = map changeText options.text }
    where
    default = fromMaybe (ParagraphBlockData "") $ buildBlockData Paragraph $ defaultBlockDataOptions { text = Just "" }
    options = getBlockDataOptions block
    ty = getBlockType block
  removeBetween :: forall a. Int -> Int -> Array a -> Array a
  removeBetween start end array = catMaybes $ mapWithIndex (\i-> \x-> if start <= i && i <= end then Nothing else Just x) array

  normalizeBlockData :: BlockData -> BlockData
  normalizeBlockData block = case block of
    ParagraphBlockData str -> 
      if str == "# " then
        mkHeader 1 ""
      else if str == "## " then
        mkHeader 2 ""
      else if str == "### " then
        mkHeader 3 ""
      else if str == "#### " then
        mkHeader 4 ""
      else
        block
    x -> x 
    where
    mkHeader level text = fromMaybe (ParagraphBlockData "") $ buildBlockData Header $ defaultBlockDataOptions { text = Just text, level = Just level }