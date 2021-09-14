module Incentknow.Organisms.ActivityView where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API.Execution (Remote)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, remoteArrayWith, remoteWith, userIcon, userPlate)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (ActivityAction(..), IntactActivityBySpace)
import Incentknow.HTML.DateTime (elapsedTime)
import Incentknow.HTML.Utils (css, link, maybeElem)
import Incentknow.Route (Route(..), UserTab(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Remote (Array IntactActivityBySpace)
    }

type State
  = { activities :: Remote (Array IntactActivityBySpace)
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
  { activities: input.value
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-activity-view"
    [ HH.text "Activities" ]
    [ remoteArrayWith state.activities \activities->
        HH.div []
          (map renderActivity activities)
    ]
  where
  renderActivity :: IntactActivityBySpace -> H.ComponentHTML Action ChildSlots m
  renderActivity activity =
    HH.div [ css "item" ]
      [ link NavigateRoute (User activity.actorUser.displayId UserMain)
          [ css "usericon" ]
          [ userIcon activity.actorUser.iconImage ]
      , HH.div [ css "action" ]
          [ HH.div [ css "time" ]
              [ elapsedTime activity.timestamp  ]
          , link NavigateRoute (User activity.actorUser.displayId UserMain)
              [ css "username" ]
              [ HH.text $ activity.actorUser.displayName <> "さん" ]
          , case activity.action of
              ContentCreatedActivityAction _ -> HH.text "が作成しました"
              ContentUpdatedActivityAction _ -> HH.text "が編集しました"
              ContentCommentedActivityAction _ _ -> HH.text "がコメントしました"
          ]
      , maybeElem maybeContent \content->
          HH.div [ css "content" ] 
            [ link NavigateRoute (Content content.contentId)
                [ css "title" ]
                [ HH.text (getContentSemanticData content.data content.format).title ]
            , link NavigateRoute (Container content.format.space.displayId content.format.displayId)
                  [ css "format" ]
                  [ formatWithIcon content.format 
                  ]
            ]
      ]
    where
    maybeContent = case activity.action of
      ContentCreatedActivityAction content -> Just content
      ContentUpdatedActivityAction content -> Just content
      ContentCommentedActivityAction content _ -> Just content

    maybeComment = case activity.action of
      ContentCommentedActivityAction _ comment -> Just comment
      _ -> Nothing

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route