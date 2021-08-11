module Incentknow.Molecules.SelectMenu where

import Prelude

import Data.Array (cons, filter, foldr, length)
import Data.Array as Array
import Data.Foldable (for_, traverse_)
import Data.Map (Map, union)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.Set as S
import Data.String (Pattern(..), Replacement(..), contains, replace)
import Data.String.Utils (includes)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (RefLabel(..), getHTMLElementRef, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API.Execution (Callback, Fetch, Remote, callbackAPI, executeAPI, forItem, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Molecules.SelectMenuImpl as SelectMenuImpl
import Test.Unit.Console (consoleLog)

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

emptyCandidateSet :: forall a. CandidateSet a
emptyCandidateSet = { items: [], completed: false }

type CandidateSet a
  = { items :: Array (SelectMenuItem a)
    , completed :: Boolean
    }

type Input a
  = { value :: Maybe a
    , disabled :: Boolean
    , fetchMultiple :: Maybe String -> Maybe (Callback (Fetch (CandidateSet a)))
    , fetchSingle :: Maybe (a -> Callback (Fetch (SelectMenuItem a)))
    , fetchId :: String
    , initial :: CandidateSet a
    , visibleCrossmark :: Boolean
    }

type State a
  = { value :: Maybe a
    , disabled :: Boolean
    , fetchMultiple :: Maybe String -> Maybe (Callback (Fetch (CandidateSet a)))
    , fetchSingle :: Maybe (a -> Callback (Fetch (SelectMenuItem a)))
    , fetchId :: String
    , candidateMap :: Map (Maybe String) (CandidateSet a)
    , searchWord :: Maybe String
    , allItems :: Map a (SelectMenuItem a)
    , visibleCrossmark :: Boolean
    }

data Action a
  = Initialize
  | Load
  | HandleInput (Input a)
  | ImplAction (SelectMenuImpl.Output a)
  | GetMultiple (Maybe String) (Fetch (CandidateSet a))
  | GetSingle (Fetch (SelectMenuItem a))

data Query id a
  = GetValue (Maybe id -> a)

type Output a
  = Maybe a

type Slot a p
  = H.Slot (Query a) (Output a) p

type ChildSlots a
  = ( impl :: SelectMenuImpl.Slot a Unit )

foreign import equalsFunction :: forall a b. (a -> b) -> (a -> b) -> Boolean

initialState :: forall a. Ord a => Input a -> State a
initialState input =
  { value: input.value
  , disabled: input.disabled
  , fetchMultiple: input.fetchMultiple
  , fetchSingle: input.fetchSingle
  , fetchId: input.fetchId
  , candidateMap: M.fromFoldable [ Tuple Nothing input.initial ]
  , searchWord: Nothing
  , allItems: M.fromFoldable $ map (\x -> Tuple x.id x) input.initial.items
  , visibleCrossmark: input.visibleCrossmark
  }

setInput :: forall a. Ord a => State a -> Input a -> State a
setInput state input =
  state
    { value = input.value
    , disabled = input.disabled
    , fetchMultiple = input.fetchMultiple
    , fetchSingle = input.fetchSingle
    , fetchId = input.fetchId
    -- , candidateMap = M.alter (Just <<< fromMaybe input.initial) Nothing state.candidateMap
    -- , allItems = foldr (\item-> M.insert item.id item) state.allItems input.initial.items
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
    , selectedItem: flatten $ map (\value -> M.lookup value state.allItems) state.value
    , message: if isNothing cand then Just $ HH.text "候補はありません" else Nothing
    , searchWord: state.searchWord
    , disabled: state.disabled
    , visibleCrossmark: state.visibleCrossmark
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
    for_ (state.fetchMultiple Nothing) \fetch -> do
      callbackAPI (GetMultiple Nothing) fetch
    for_ state.value \value -> do
      case M.lookup value state.allItems of
        Nothing ->
          for_ state.fetchSingle \fetch ->
            callbackAPI GetSingle $ fetch value
        _ -> pure unit
  HandleInput input -> do
    state <- H.get
    H.modify_ $ flip setInput input
    when (state.fetchId /= input.fetchId) do
      handleAction Load
  ImplAction output -> case output of
    SelectMenuImpl.ChangeValue value -> do
      H.modify_ _ { value = value }
      H.raise $ value
    SelectMenuImpl.ChangeSearchWord word -> do
      H.modify_ _ { searchWord = word }
      state <- H.get
      case getAllCandidates state.candidateMap of
        Nothing -> do
          for_ (state.fetchMultiple word) \fetch ->
            callbackAPI (GetMultiple word) fetch
        _ -> pure unit
  GetMultiple word fetch -> do
    forItem fetch \cands ->
      H.modify_ \x -> x
        { candidateMap = M.insert word cands x.candidateMap
        , allItems = foldr (\item -> M.insert item.id item) x.allItems cands.items
        }
  GetSingle fetch -> do
    forItem fetch \item ->
      H.modify_ \x -> x { allItems = M.insert item.id item x.allItems }
