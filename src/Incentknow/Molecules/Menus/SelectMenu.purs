module Incentknow.Molecules.SelectMenu where

import Prelude

import Control.Promise (Promise)
import Data.Array (filter, length)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Foldable (for_, traverse_)
import Data.Map (Map, union)
import Data.Map as Map
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.String (Pattern(..), Replacement(..), contains, replace)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (RefLabel(..), getHTMLElementRef, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Core (ref)
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api.Utils (callbackApi, executeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (loadingWith)
import Incentknow.Data.Utils (generateId)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Web.DOM (Element)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLElement (focus)
import Web.HTML.HTMLElement (fromElement)
import Web.HTML.Window (document)

type SelectMenuItem a
  = { id :: a
    , name :: String
    , searchWord :: String
    , html :: forall a s m. H.ComponentHTML a s m
    }

upsertItems :: forall a. Ord a => Array (SelectMenuItem a) -> Array (SelectMenuItem a) -> Array (SelectMenuItem a)
upsertItems additions src = Array.fromFoldable $ Map.values $ union (toMap additions) (toMap src)
  where
  toMap xs = Map.fromFoldable (map (\x-> Tuple x.id x) xs)

data SelectMenuResource a
  = SelectMenuResourceAllCandidates (Array (SelectMenuItem a))
  | SelectMenuResourceFetchFunctions
    { search :: String -> Aff (Either String (Array (SelectMenuItem a)))
    , get :: a -> (SelectMenuItem a -> Effect Unit) -> Effect Unit
    }

type Input a
  = { resource :: SelectMenuResource a
    , value :: Maybe a
    , disabled :: Boolean
    }

type State a
  = { resource :: SelectMenuResource a
    , displayItems :: Array (SelectMenuItem a)
    , isFocused :: Boolean
    , isMouseEnterListBox :: Boolean
    , filter :: String
    , selectedId :: Maybe a
    , selectedItem :: Maybe (SelectMenuItem a)
    , textbox :: Maybe Element
    , disabled :: Boolean
    , loadingItems :: Boolean
    , loadingError :: Maybe String
    }

data Action a
  = Initialize
  | Load
  | ClickItem (SelectMenuItem a)
  | SetSelectedItem (SelectMenuItem a)
  | FocusTextArea
  | BlurTextArea
  | Unselect
  | ChangeFilter String
  | MouseEnterListBox
  | MouseLeaveListBox
  | HandleInput (Input a)
  | ClickValue
  | ClickTextArea
  | GetTextBox (Maybe Element)

data Query id a
  = GetValue (Maybe id -> a)

type Output a
  = Maybe a

type Slot a p
  = H.Slot (Query a) (Output a) p

component :: forall m a. Ord a => Eq a => Behaviour m => MonadAff m => H.Component HH.HTML (Query a) (Input a) (Output a) m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , handleQuery = handleQuery
            , receive = Just <<< HandleInput
            }
    }

setInput :: forall a. Ord a => State a -> Input a -> State a
setInput state input =
  state
    { resource = input.resource
    , displayItems = displayItems
    , selectedId = input.value
    , selectedItem = selectedItem
    , filter = state.filter
    , disabled = input.disabled
    }
  where
  selectedItem = case input.resource of
    SelectMenuResourceAllCandidates items -> maybe Nothing (flip Map.lookup itemDict) input.value
      where
      itemDict = Map.fromFoldable $ map (\x -> Tuple x.id x) items
    SelectMenuResourceFetchFunctions _ -> if state.selectedId == input.value then state.selectedItem else Nothing

  displayItems = case input.resource of
    SelectMenuResourceAllCandidates items -> getDisplayItems state.filter items
    SelectMenuResourceFetchFunctions _ -> state.displayItems

initialState :: forall a. Eq a => Ord a => Input a -> State a
initialState =
  setInput
    { resource: SelectMenuResourceAllCandidates []
    , displayItems: []
    , isFocused: false
    , isMouseEnterListBox: false
    , filter: ""
    , selectedId: Nothing
    , selectedItem: Nothing
    , textbox: Nothing
    , disabled: false
    , loadingItems: false
    , loadingError: Nothing
    }

textbox_ = RefLabel "textbox"

render :: forall m a. State a -> H.ComponentHTML (Action a) () m
render state =
  HH.div [ css if state.disabled then "mol-select-menu disabled" else "mol-select-menu" ]
    [ if (isNothing state.selectedId || state.isFocused) && not state.disabled then
        HH.textarea
          [ css "filter"
          , HP.value $ replace (Pattern "\n") (Replacement "") state.filter
          , HE.onValueInput $ Just <<< ChangeFilter
          --, HP.autocomplete false
          , HP.spellcheck false
          , HE.onFocus $ \_ -> Just FocusTextArea
          , HE.onBlur $ \_ -> Just BlurTextArea
          , HE.onClick $ \_ -> Just ClickTextArea
          , HP.ref textbox_
          ]
      else
        HH.div
          [ css "value"
          ]
          [ HH.span
              [ css "name"
              , HE.onClick $ \_ -> if state.disabled then Nothing else Just ClickValue
              ]
              [ case state.selectedItem of
                  Just value -> HH.text value.name
                  Nothing -> loadingWith "読み込み中"
              ]
          , whenElem (not state.disabled) \_ ->
              HH.span
                [ css "crossmark"
                , HE.onClick $ \_ -> Just Unselect
                ]
                []
          ]
    , whenElem (state.isFocused && not state.disabled) \_ ->
        HH.ul
          [ css "listbox"
          , HE.onMouseEnter $ \_ -> Just MouseEnterListBox
          , HE.onMouseLeave $ \_ -> Just MouseLeaveListBox
          ]
          ( if state.loadingItems then
              [ messageItem $ loadingWith "読み込み中" ]
            else
              if length state.displayItems == 0 then
                case state.resource of
                  SelectMenuResourceAllCandidates _ ->
                    [ messageItem $ HH.text "候補はありません" ]
                  SelectMenuResourceFetchFunctions _ ->
                    if state.filter == "" then
                      [ messageItem $ HH.text "検索ワードを入力してください" ]
                    else
                      case state.loadingError of
                        Just error ->
                          [ messageItem $ HH.text $ "検索に失敗しました:" <> error ]
                        Nothing ->
                          [ messageItem $ HH.text "検索結果はありませんでした" ]
              else
                map renderItem state.displayItems
          )
    ]
  where
  renderItem :: SelectMenuItem a -> H.ComponentHTML (Action a) () m
  renderItem item =
    HH.li
      [ css "item"
      , HE.onClick (\_ -> Just $ ClickItem item)
      ]
      [ item.html
      ]

  messageItem :: H.ComponentHTML (Action a) () m -> H.ComponentHTML (Action a) () m
  messageItem msg =
    HH.li [ css "item" ] [ msg ]

getDisplayItems :: forall a. String -> Array (SelectMenuItem a) -> Array (SelectMenuItem a)
getDisplayItems word items = if word == "" then items else filter (\x -> contains (Pattern word) x.searchWord) items

handleAction :: forall m a. Eq a => Ord a => Behaviour m => MonadAff m => Action a -> H.HalogenM (State a) (Action a) () (Output a) m Unit
handleAction = case _ of
  Initialize -> do
    handleAction Load
  Load -> do
    state <- H.get
    for_ state.selectedId \selectedId ->
      when (isNothing state.selectedItem) case state.resource of
        SelectMenuResourceFetchFunctions src -> callbackApi SetSelectedItem $ src.get selectedId
        SelectMenuResourceAllCandidates _ -> pure unit
  ClickItem item -> do
    H.modify_ _ { selectedId = Just item.id, selectedItem = Just item, isFocused = false, isMouseEnterListBox = false }
    H.raise $ Just item.id
  SetSelectedItem item -> do
    state <- H.get
    for_ state.selectedId \selectedId ->
      when (item.id == selectedId) do
        H.modify_ _ { selectedItem = Just item }
  Unselect -> do
    H.modify_ _ { selectedId = Nothing, selectedItem = Nothing }
    H.raise Nothing
  FocusTextArea -> H.modify_ _ { isFocused = true }
  MouseEnterListBox -> H.modify_ _ { isMouseEnterListBox = true }
  MouseLeaveListBox -> H.modify_ _ { isMouseEnterListBox = false }
  ChangeFilter filter -> do
    state <- H.get
    case state.resource of
      SelectMenuResourceAllCandidates items ->
        H.modify_ \x -> x { filter = filter, displayItems = getDisplayItems filter items }
      SelectMenuResourceFetchFunctions src -> do
        H.modify_ _ { filter = filter, displayItems = [], loadingItems = true, loadingError = Nothing }
        result <- H.liftAff $ src.search filter
        case result of
          Right items -> do
            latestState <- H.get
            when (latestState.filter == filter) do
              H.modify_ _ { displayItems = items, loadingItems = false }
          Left error ->
            H.modify_ _ { loadingError = Just error, loadingItems = false  }
  BlurTextArea ->
    H.modify_ \x ->
      if x.isMouseEnterListBox then x else x { isFocused = false }
  HandleInput input -> do
    H.modify_ $ flip setInput input
    handleAction Load
  GetTextBox textbox -> H.modify_ _ { textbox = textbox }
  ClickTextArea -> H.modify_ _ { isMouseEnterListBox = false }
  ClickValue -> do
    H.modify_ _ { isMouseEnterListBox = false, isFocused = true }
    getHTMLElementRef textbox_
      >>= traverse_ \textbox -> do
          liftEffect $ focus textbox

handleQuery :: forall m a r. Query a r -> H.HalogenM (State a) (Action a) () (Output a) m (Maybe r)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    pure $ Just $ k $ state.selectedId
