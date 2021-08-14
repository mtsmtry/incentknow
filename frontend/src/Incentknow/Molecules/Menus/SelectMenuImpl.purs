module Incentknow.Molecules.SelectMenuImpl where

import Prelude

import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.String (Pattern(..), Replacement(..), replaceAll)
import Effect.Aff.Class (class MonadAff)
import Halogen (RefLabel(..), getHTMLElementRef, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (loadingWith)
import Incentknow.HTML.Utils (css, whenElem)
import Web.DOM (Element)
import Web.HTML.HTMLElement (focus)

data Action a
  = Initialize
  -- For the textarea
  | FocusTextArea
  | BlurTextArea
  | ClickTextArea
  -- For the listbox
  | MouseEnterListBox
  | MouseLeaveListBox
  -- Others
  | Unselect
  | ClickItem (SelectMenuItem a)
  | ChangeFilter String
  | HandleInput (Input a)
  | ClickValue

initialState :: forall a. Eq a => Ord a => Input a -> State a
initialState =
  setInput
    { message: Nothing
    , items: []
    , isFocused: false
    , isMouseEnterListBox: false
    , searchWord: Nothing
    , selectedItem: Nothing
    , textbox: Nothing
    , disabled: false
    , visibleCrossmark: true
    }

component :: forall m a q. Ord a => Eq a => Behaviour m => MonadAff m => H.Component HH.HTML q (Input a) (Output a) m
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

data Output a
  = ChangeValue (Maybe a)
  | ChangeSearchWord (Maybe String)

type SelectMenuItem a
  = { id :: a
    , name :: String
    , searchWord :: String
    , html :: forall a2 s m. H.ComponentHTML a2 s m
    }

type Input a
  = { items :: Array (SelectMenuItem a)
    , selectedItem :: Maybe (SelectMenuItem a)
    , searchWord :: Maybe String
    , message :: forall w i. Maybe (HH.HTML w i)
    , disabled :: Boolean
    , visibleCrossmark :: Boolean
    }

type State a
  = { items :: Array (SelectMenuItem a)
    , searchWord :: Maybe String
    , disabled :: Boolean
    , isFocused :: Boolean
    , isMouseEnterListBox :: Boolean
    , textbox :: Maybe Element
    , selectedItem :: Maybe (SelectMenuItem a)
    , message :: forall w i. Maybe (HH.HTML w i)
    , visibleCrossmark :: Boolean
    }

type Slot a p
  = forall q. H.Slot q (Output a) p

setInput :: forall a. Ord a => State a -> Input a -> State a
setInput state input =
  state
    { items = input.items
    , searchWord = input.searchWord
    , selectedItem = input.selectedItem
    , disabled = input.disabled
    , visibleCrossmark = input.visibleCrossmark
    }

textbox_ :: RefLabel
textbox_ = RefLabel "textbox"

render :: forall m a. State a -> H.ComponentHTML (Action a) () m
render state =
  HH.div [ css if state.disabled then "mol-select-menu disabled" else "mol-select-menu" ]
    [ if (isNothing state.selectedItem || state.isFocused) && not state.disabled then
        -- A textbox for search words or filter words
        HH.textarea
          [ css "filter"
          , HP.value $ replaceAll (Pattern "\n") (Replacement "") $ fromMaybe "" state.searchWord
          , HE.onValueInput $ Just <<< ChangeFilter
          , HP.spellcheck false
          , HE.onFocus $ \_ -> Just FocusTextArea
          , HE.onBlur $ \_ -> Just BlurTextArea
          , HE.onClick $ \_ -> Just ClickTextArea
          , HP.ref textbox_
          ]
      else
        -- The selected item
        HH.div
          [ css "value"
          ]
          [ HH.span
              [ css "name"
              , HE.onClick $ \_ -> if state.disabled then Nothing else Just ClickValue
              ]
              [ case state.selectedItem of
                  Just value -> HH.text value.name
                  Nothing -> if state.disabled then HH.text "" else loadingWith "読み込み中"
              ]
          , whenElem (not state.disabled && state.visibleCrossmark) \_ ->
              HH.span
                [ css "crossmark"
                , HE.onClick $ \_ -> Just Unselect
                ]
                []
          ]
    , whenElem (state.isFocused && not state.disabled) \_ ->
        -- The candidates list
        HH.ul
          [ css "listbox"
          , HE.onMouseEnter $ \_ -> Just MouseEnterListBox
          , HE.onMouseLeave $ \_ -> Just MouseLeaveListBox
          ]
          ( case state.message of
              Just message -> [ message ]
              Nothing -> map renderItem state.items
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

handleAction :: forall m a. Eq a => Ord a => Behaviour m => MonadAff m => Action a -> H.HalogenM (State a) (Action a) () (Output a) m Unit
handleAction = case _ of
  -- Events from the textarea
  FocusTextArea -> H.modify_ _ { isFocused = true }
  ClickTextArea -> H.modify_ _ { isMouseEnterListBox = false }
  BlurTextArea -> H.modify_ \x -> if x.isMouseEnterListBox then x else x { isFocused = false }
  -- Events from the listbox
  MouseEnterListBox -> H.modify_ _ { isMouseEnterListBox = true }
  MouseLeaveListBox -> H.modify_ _ { isMouseEnterListBox = false }
  Initialize -> pure unit
  ClickItem item -> do
    H.modify_ _ { selectedItem = Just item, isFocused = false, isMouseEnterListBox = false }
    H.raise $ ChangeValue $ Just item.id
  Unselect -> do
    H.modify_ _ { selectedItem = Nothing }
    H.raise $ ChangeValue Nothing
  ChangeFilter word -> do
    H.raise $ ChangeSearchWord $ if word == "" then Nothing else Just word
  HandleInput input -> do
    H.modify_ $ flip setInput input
  ClickValue -> do
    H.modify_ _ { isMouseEnterListBox = false, isFocused = true }
    getHTMLElementRef textbox_
      >>= traverse_ \textbox -> do
          liftEffect $ focus textbox
