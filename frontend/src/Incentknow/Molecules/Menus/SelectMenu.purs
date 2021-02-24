module Incentknow.Molecules.SelectMenu where

import Prelude

import Control.Promise (Promise)
import Data.Array (cons, filter, foldr, length)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Foldable (for_, traverse_)
import Data.Map (Map, union)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.String (Pattern(..), Replacement(..), contains, replace)
import Data.String.Utils (includes)
import Data.Symbol (SProxy(..))
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
import Incentknow.API.Execution (Callback, Remote, callbackAPI, executeAPI)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (loadingWith)
import Incentknow.Data.Utils (generateId)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Molecules.SelectMenuImpl as SelectMenuImpl
import Web.DOM (Element)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLElement (focus)
import Web.HTML.HTMLElement (fromElement)
import Web.HTML.Window (document)

{-
  A component for receiving a selection from a list of the certine type
  
  This is to provide the best user experience to select the intended one accurately and quickly.
  Therefore, this shows each candidate by the best abstraction and format depending on the type of them.
  to use the draw html function specified from the input value. And, this corresponds various resources,
  constants, to fetch, to search, and a combination of them.
-}
upsertItems :: forall a. Ord a => Array (SelectMenuItem a) -> Array (SelectMenuItem a) -> Array (SelectMenuItem a)
upsertItems additions src = Array.fromFoldable $ Map.values $ union (toMap additions) (toMap src)
  where
  toMap xs = Map.fromFoldable (map (\x -> Tuple x.id x) xs)

type CandidateSet a
  = { items :: Array (SelectMenuItem a)
    , completed :: Boolean
    }

type Input a
  = { value :: Maybe a
    , disabled :: Boolean
    , fetchMultiple :: Maybe String -> Callback (CandidateSet a)
    , fetchSingle :: a -> Callback (SelectMenuItem a)
    , initial :: CandidateSet a
    }

type State a
  = { value :: Maybe a
    , disabled :: Boolean
    , fetchMultiple :: Maybe String -> Callback (CandidateSet a)
    , fetchSingle :: a -> Callback (SelectMenuItem a)
    , candidateMap :: Map (Maybe String) (CandidateSet a)
    , searchWord :: Maybe String
    , allItems :: Map a (SelectMenuItem a)
    }

data Action a
  = Initialize
  | Load
  | HandleInput (Input a)
  | ImplAction (SelectMenuImpl.Output a)
  | GetMultiple (Maybe String) (CandidateSet a)
  | GetSingle (SelectMenuItem a)

data Query id a
  = GetValue (Maybe id -> a)

type Output a
  = Maybe a

type Slot a p
  = H.Slot (Query a) (Output a) p

type ChildSlots a
  = ( impl :: SelectMenuImpl.Slot a Unit )

initialState :: forall a. Ord a => Input a -> State a
initialState input =
  { value: input.value
  , disabled: input.disabled
  , fetchMultiple: input.fetchMultiple
  , fetchSingle: input.fetchSingle
  , candidateMap: M.fromFoldable [ Tuple Nothing input.initial ]
  , searchWord: Nothing
  , allItems: M.fromFoldable $ map (\x-> Tuple x.id x) input.initial.items
  }

setInput :: forall a. Ord a => State a -> Input a -> State a
setInput state input =
  state
    { value = input.value
    , disabled = input.disabled
    , fetchMultiple = input.fetchMultiple
    , fetchSingle = input.fetchSingle
    , candidateMap = M.insert Nothing input.initial state.candidateMap
    , allItems = M.fromFoldable $ map (\x-> Tuple x.id x) input.initial.items
    }

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
            , receive = Just <<< HandleInput
            }
    }

render :: forall m a. Behaviour m => MonadAff m => Ord a => State a -> H.ComponentHTML (Action a) (ChildSlots a) m
render state =
  HH.slot (SProxy :: SProxy "impl") unit SelectMenuImpl.component
    { items: fromMaybe [] cand
    , selectedItem: flatten $ map (\value-> M.lookup value state.allItems) state.value 
    , message: if isNothing cand then Just $ HH.text "候補はありません" else Nothing
    , searchWord: state.searchWord
    }
    (Just <<< ImplAction)
  where
  cand = getCandidates state.searchWord state.candidateMap

getAllCandidates :: forall a. Map (Maybe String) (CandidateSet a) -> Maybe (Array (SelectMenuItem a))
getAllCandidates m = flatten $ map (\x -> if x.completed then Just x.items else Nothing) $ M.lookup Nothing m

getCandidates :: forall a. Maybe String -> Map (Maybe String) (CandidateSet a) -> Maybe (Array (SelectMenuItem a))
getCandidates maybeWord m = case M.lookup maybeWord m of
  Just cand -> Just cand.items
  Nothing -> case getAllCandidates m of
    Just all -> case maybeWord of
      Just word -> Just $ filter (\x -> includes word x.searchWord) all
      Nothing -> Just all
    Nothing -> Nothing

handleAction :: forall m a. Eq a => Ord a => Behaviour m => MonadAff m => Action a -> H.HalogenM (State a) (Action a) (ChildSlots a) (Output a) m Unit
handleAction = case _ of
  Initialize -> do
    handleAction Load
  Load -> do
    state <- H.get
    callbackAPI (GetMultiple Nothing) $ state.fetchMultiple Nothing
    for_ state.value \value-> do
      case M.lookup value state.allItems of
        Nothing -> callbackAPI GetSingle $ state.fetchSingle value
        _ -> pure unit
  HandleInput input -> do
    H.modify_ $ flip setInput input
  ImplAction output -> case output of
    SelectMenuImpl.ChangeValue value -> do
      H.modify_ _ { value = value }
      H.raise $ value
    SelectMenuImpl.ChangeSearchWord word -> do
      H.modify_ _ { searchWord = word }
      state <- H.get
      case getAllCandidates state.candidateMap of
        Nothing -> callbackAPI (GetMultiple word) $ state.fetchMultiple word
        _ -> pure unit
  GetMultiple word cands -> do
    H.modify_ \x -> x 
      { candidateMap = M.insert word cands x.candidateMap
      , allItems = foldr (\item-> M.insert item.id item) x.allItems cands.items
      }
  GetSingle item -> do
    H.modify_ \x -> x { allItems = M.insert item.id item x.allItems }