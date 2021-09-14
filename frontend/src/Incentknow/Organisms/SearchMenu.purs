module Incentknow.Organisms.SearchMenu where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (icon, iconSolid)
import Incentknow.Atoms.Inputs (cancelReturn)
import Incentknow.HTML.Utils (css)

type Input
  = { value :: String
    }

type State
  = { text :: String
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeText String

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ()

type Output = String

component :: forall q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval 
        { initialize = Just Initialize
        , receive = Just <<< HandleInput
        , handleAction = handleAction
        }
    }

initialState :: Input -> State
initialState input = { text: input.value }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-search-menu" ]
    [ HH.div [ css "search-box" ]
        [ iconSolid "search"
        , HH.textarea
            [ HP.spellcheck false
            , HP.value state.text
            , HE.onValueInput $ Just <<< ChangeText
            , HE.onKeyDown cancelReturn
            ]
        ]
    ]

handleAction :: forall m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  ChangeText text -> do
    H.modify_ _ { text = text }
    H.raise text