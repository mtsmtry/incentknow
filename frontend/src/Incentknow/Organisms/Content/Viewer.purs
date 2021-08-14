module Incentknow.Organisms.Content.Viewer where

import Prelude

import Data.Array (filter, length)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, Type(..))
import Incentknow.Data.Property (Property, mkProperties, toPropertyComposition, toTypedValue)
import Incentknow.HTML.Utils (css, link, maybeElem, whenElem)
import Incentknow.Organisms.Content.ValueViewer as Value
import Incentknow.Organisms.UserCard as UserCard
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..))
import Incentknow.Templates.Page (section, sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { content :: FocusedContent }

type State
  = { content :: FocusedContent }

data Action
  = HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( value :: Value.Slot Unit
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
            }
    }

initialState :: Input -> State
initialState input = { content: input.content }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-content-viewer" ] $
    [ section "top"
        [ HH.div [ css "header" ]
            [ maybeElem semantic.titleProperty \title->
                HH.div [ css "title" ]
                  [ HH.div [ css "title-property" ] [ HH.text title.info.displayName ]
                  , HH.div [ css "title-text" ] [ HH.text title.text ]
                  ]
            , HH.div [ css "side" ]
                [ HH.div [ css "side-format" ] 
                    [ link Navigate (Space state.content.format.space.displayId $ SpaceFormat state.content.format.displayId FormatMain)
                        []
                        [ formatWithIcon state.content.format ]
                    ]
                , HH.div [ css "side-user" ]
                    [ HH.slot (SProxy :: SProxy "userCard") unit UserCard.component 
                        { user: state.content.creatorUser
                        , timestamp: state.content.createdAt 
                        } absurd
                    ]
                ]
            ]
        , whenElem (length infoProps > 0) \_->
            HH.div [ css "info" ] 
              [ HH.slot (SProxy :: SProxy "value") unit Value.component 
                  { value: toTypedValue state.content.data $ ObjectType $ map _.info infoProps } absurd
              ]
        ]
    ] <> (map renderSection comp.sections)
  where
  comp = toPropertyComposition false $ mkProperties state.content.data state.content.format.currentStructure.properties
  infoProps = case semantic.titleProperty of
    Just title -> filter (\x-> x.info.id /= title.info.id) comp.info
    Nothing -> comp.info
  semantic = getContentSemanticData state.content.data state.content.format

  renderSection :: Property -> H.ComponentHTML Action ChildSlots m
  renderSection prop =
    sectionWithHeader "section"
      [ HH.text prop.info.displayName ]
      [ HH.div [ css "section-value" ] 
          [ HH.slot (SProxy :: SProxy "value") unit Value.component 
              { value: toTypedValue prop.value prop.info.type } absurd
          ]
      ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
  Navigate e route -> navigateRoute e route