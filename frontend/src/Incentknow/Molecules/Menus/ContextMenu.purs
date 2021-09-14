module Incentknow.Molecules.ContextMenu where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (iconSolid)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Route (Route)
import Test.Unit.Console (consoleLog)

data Action
  = Initialize
  | ShowMenu
  | MouseEnterMenu
  | MouseLeaveMenu
  -- Others
  | ClickItem ContentMenuItem
  | HandleInput Input
  | OnBlur

type Output = String

initialState :: Input -> State
initialState input =
  { items: input.items
  , isFocused: false
  , visibleButton: input.visibleButton
  , isMouseEnterMenu: false
  }

component :: forall m q. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
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

data ContentMenuItem
  = LinkItem String String Route
  | EventItem String String (Unit -> Aff Unit)

type Input
  = { items :: Array ContentMenuItem
    , visibleButton :: Boolean
    }

type State
  = { items :: Array ContentMenuItem
    , isFocused :: Boolean
    , visibleButton :: Boolean
    , isMouseEnterMenu :: Boolean
    }

type Slot p
  = forall q. H.Slot q Output p

render :: forall m o. State -> H.ComponentHTML Action o m
render state =
  HH.div [ css $ "mol-context-menu" <> if state.visibleButton then "" else " notvisible" ]
    [ HH.span 
        [ css $ "button" <> if state.visibleButton then "" else " notvisible"
        , HE.onClick $ \_ -> Just ShowMenu
        , HE.onBlur $ \_-> Just OnBlur
        , HP.tabIndex 1
        ]
        [ iconSolid "ellipsis-h" ]
    , whenElem state.isFocused \_ ->
        -- The candidates list
        HH.ul
          [ css "listbox"
          , HE.onMouseEnter $ \_ -> Just MouseEnterMenu
          , HE.onMouseLeave $ \_ -> Just MouseLeaveMenu
          ]
          (map renderItem state.items)
    ]
  where
  renderItem :: ContentMenuItem -> H.ComponentHTML Action o m
  renderItem item =
    HH.li
      [ css "item"
      , HE.onClick (\_ -> Just $ ClickItem item)
      ]
      ( case item of
          LinkItem icon text _ -> [ iconSolid icon, HH.text text ]
          EventItem icon text _ -> [ iconSolid icon, HH.text text ]
      )

handleAction :: forall m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction = case _ of
  -- Events from the textarea
  ShowMenu -> H.modify_ _ { isFocused = true }
  OnBlur -> H.modify_ \x -> if x.isMouseEnterMenu then x else x { isFocused = false }
  MouseEnterMenu -> H.modify_ _ { isMouseEnterMenu = true }
  MouseLeaveMenu -> H.modify_ _ { isMouseEnterMenu = false }
  -- Events from the listbox
  Initialize -> pure unit
  ClickItem item -> do
    liftEffect $ consoleLog "ContextMenu.ClickItem"
    state <- H.get
    H.modify_ _ { isFocused = false, isMouseEnterMenu = false }
    case item of
      LinkItem _ name route -> navigate route
      EventItem _ name event -> do
        liftAff $ event unit
        H.raise name
  HandleInput input -> H.modify_ _ { items = input.items, visibleButton = input.visibleButton }
