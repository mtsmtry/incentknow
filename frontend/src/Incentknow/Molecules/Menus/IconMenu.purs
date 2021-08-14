module Incentknow.Molecules.IconMenu where

import Prelude

import Control.Promise (Promise, toAff)
import Data.Array (filter)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust)
import Data.Maybe.Utils (flatten)
import Data.String (joinWith)
import Data.String.Utils (includes)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (iconSolid)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Molecules.SelectMenuImpl as SelectMenuImpl

type FontawesomeIcon
  = { searchwords :: Array String
    , label :: String
    , name :: String
    }

foreign import getIcons :: Effect (Promise (Array FontawesomeIcon))

toSelectMenuItem :: FontawesomeIcon -> SelectMenuItem String
toSelectMenuItem i =
  { id: i.name
  , name: i.label
  , searchWord: i.name <> " " <> joinWith " " i.searchwords
  , html: HH.span [] [ iconSolid i.name, HH.text i.label ]
  }

type Input
  = { value :: Maybe String
    , disabled :: Boolean
    }

type State
  = { value :: Maybe String
    , icons :: Array (SelectMenuItem String)
    , searchWord :: Maybe String
    , disabled :: Boolean
    , allItems :: Map String (SelectMenuItem String)
    }

data Action
  = Initialize
  | HandleInput Input
  | ImplAction (SelectMenuImpl.Output String)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( impl :: SelectMenuImpl.Slot String Unit )

type Output
  = Maybe String

component :: forall q m. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
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
  { value: input.value
  , icons: []
  , searchWord: Nothing
  , disabled: input.disabled
  , allItems: M.empty
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "iconMenu" ]
    [ HH.slot (SProxy :: SProxy "impl") unit SelectMenuImpl.component
        { items: 
            case state.searchWord of
              Just word -> filter (\x -> includes word x.searchWord) state.icons
              Nothing -> state.icons
        , selectedItem: flatten $ map (\value -> M.lookup value state.allItems) state.value
        , message: Nothing
        , searchWord: state.searchWord
        , disabled: state.disabled
        , visibleCrossmark: true
        }
        (Just <<< ImplAction)
    ]

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    promise <- H.liftEffect getIcons
    icons <- H.liftAff $ toAff promise
    let items = map toSelectMenuItem icons
    H.modify_ _ { icons = items, allItems = M.fromFoldable $ map (\x -> Tuple x.id x) items }
  HandleInput input -> do
    H.modify_ _ { disabled = input.disabled }
    when (isJust input.value) do
      H.modify_ _ { value = input.value }
  ImplAction output -> case output of
    SelectMenuImpl.ChangeValue value -> do
      H.modify_ _ { value = value }
      H.raise $ value
    SelectMenuImpl.ChangeSearchWord word -> do
      H.modify_ _ { searchWord = word }