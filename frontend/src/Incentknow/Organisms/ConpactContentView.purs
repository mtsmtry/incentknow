module Incentknow.Organisms.ConpactContentView where

import Prelude

import Data.Array (filter, length)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (iconSolid)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, Type(..))
import Incentknow.Data.Property (Property, mkProperties, toPropertyComposition, toTypedValue)
import Incentknow.HTML.Utils (css, link, whenElem)
import Incentknow.Organisms.Content.ValueViewer as Value
import Incentknow.Organisms.UserCard as UserCard
import Incentknow.Route (Route(..))
import Web.DOM.Element (clientHeight)
import Web.HTML.HTMLElement (toElement)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: FocusedContent }

type State
  = { content :: FocusedContent, isExpanded :: Boolean, overHeight :: Boolean }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | Expand

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( value :: Value.Slot String
    , userCard :: UserCard.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            , initialize = Just Initialize
            }
    }

initialState :: Input -> State
initialState input = { content: input.value, isExpanded: false, overHeight: false }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-conpact-content-view" ]
    [ HH.div 
        [ css $ "body" <> if state.isExpanded || not state.overHeight then "" else " folded"
        , HP.ref (H.RefLabel "body")
        ]
        [ HH.div [ css "left" ]
            [  HH.div [ css "user" ]
                [ HH.slot (SProxy :: SProxy "userCard") unit UserCard.component 
                    { user: state.content.creatorUser
                    , timestamp: state.content.createdAt 
                    } absurd
                ]
            , whenElem (length infoProps > 0) \_->
                HH.div [ css "info" ] 
                  [ HH.slot (SProxy :: SProxy "value") "top" Value.component 
                      { value: toTypedValue state.content.data $ ObjectType $ map _.info infoProps } absurd
                  ]
            ]
        , HH.div [ css "right" ]
            [ link NavigateRoute (Content state.content.contentId) 
                [ css "title" ]
                [ HH.text semantic.title ]
            , HH.div [ css "materials" ] (map renderSection comp.sections)
            ]
        ]
    , whenElem state.overHeight \_->
        HH.div [ css "expand", HE.onClick $ \_-> Just Expand ]
          [ if state.isExpanded then iconSolid "angle-up" else iconSolid "angle-down" 
          ]
    ]
  where
  comp = toPropertyComposition false $ mkProperties state.content.data state.content.format.currentStructure.properties
  infoProps = case semantic.titleProperty of
    Just title -> filter (\x-> x.info.id /= title.info.id) comp.info
    Nothing -> comp.info
  semantic = getContentSemanticData state.content.data state.content.format

  renderSection :: Property -> H.ComponentHTML Action ChildSlots m
  renderSection prop =
    HH.div [ css "material" ]
      [ HH.div [ css "property" ] [ HH.text prop.info.displayName ]
      , HH.div [ css "value" ]
          [ HH.slot (SProxy :: SProxy "value") (unwrap prop.info.id) Value.component 
              { value: toTypedValue prop.value prop.info.type } absurd
          ]
      ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    maybeElement <- H.getHTMLElementRef (H.RefLabel "body")
    for_ maybeElement \element-> do
      height <- liftEffect $ clientHeight $ toElement element
      -- liftEffect $ consoleLog $ "clientHeight" <> show height
      H.modify_ _ { overHeight = height > 300.0 }
  HandleInput input -> do
    H.put $ initialState input
    handleAction Initialize
  Navigate route -> navigate route
  NavigateRoute e route -> navigateRoute e route
  Expand -> H.modify_ \x-> x { isExpanded = not x.isExpanded }