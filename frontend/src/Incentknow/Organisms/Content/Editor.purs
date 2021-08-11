module Incentknow.Organisms.Content.Editor where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedContent, FocusedContentDraft, Type(..), FocusedFormat)
import Incentknow.Data.Ids (PropertyId(..))
import Incentknow.Data.Property (Property, TypedValue, assignJson, insertJson, mkProperties, toJsonFromTypedValue, toPropertyComposition, toTypedValue)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Content.Common (EditEnvironment, EditorInput)
import Incentknow.Organisms.Content.ValueEditor as Value
import Incentknow.Templates.Page (section, sectionWithHeader)

type State
  = { format :: FocusedFormat
    , value :: Json
    , env :: EditEnvironment
    }

data Action
  = HandleInput EditorInput
  | ChangeInfo TypedValue
  | ChangeSection PropertyId TypedValue

type Slot p
  = forall q. H.Slot q Output p

type Output
  = Json

type ChildSlots
  = ( value :: Value.Slot String
    )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditorInput Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: EditorInput -> State
initialState input =
  { format: input.format
  , value: input.value
  , env: input.env
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = 
  HH.div [ css "org-content-editor" ] $
    [ section "top"
        [ HH.slot (SProxy :: SProxy "value") "top" Value.component 
            { value: toTypedValue state.value $ ObjectType $ map _.info comp.info, env: state.env }
            (Just <<< ChangeInfo)
        ]
    ] <> (map renderSection comp.sections)
  where
  comp = toPropertyComposition true $ mkProperties state.value state.format.currentStructure.properties

  renderSection :: Property -> H.ComponentHTML Action ChildSlots m
  renderSection prop =
    sectionWithHeader "section"
      [ HH.text prop.info.displayName ]
      [ HH.div [ css "section-value" ] 
          [ HH.slot (SProxy :: SProxy "value") (unwrap prop.info.id) Value.component 
              { value: toTypedValue prop.value prop.info.type, env: state.env } 
              (Just <<< ChangeSection prop.info.id)
          ]
      ]

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
  ChangeInfo info -> do
    state <- H.get
    let newValue = assignJson state.value $ toJsonFromTypedValue info
    H.modify_ _ { value = newValue }
    H.raise newValue
  ChangeSection id section -> do
    state <- H.get
    let newValue = insertJson (unwrap id) (toJsonFromTypedValue section) state.value
    H.modify_ _ { value = newValue }
    H.raise newValue