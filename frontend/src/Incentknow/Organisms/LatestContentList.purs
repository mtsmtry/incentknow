module Incentknow.Organisms.LatestContentList where

import Prelude

import Data.DateTime.Utils (fromTimestampToElapsedTimeString)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getSpaceLatestContents)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, remoteWith, userIcon)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Ids (SpaceDisplayId, SpaceId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.BoxView as BoxView
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..), UserTab(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId }

type State
  = { spaceId :: SpaceId
    , spaceDisplayId :: SpaceDisplayId
    , contents :: Remote (Array RelatedContent)
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | FetchedContents (Fetch (Array RelatedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , listView :: ListView.Slot Unit
    , dataGridView :: DataGridView.Slot Unit
    , boxView :: BoxView.Slot Unit
    )

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
  { spaceId: input.spaceId
  , spaceDisplayId: input.spaceDisplayId
  , contents: Loading
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-latest-contentlist"
    [ HH.text "Activity" ]
    [ HH.table_
      [ remoteWith state.contents \contents->
          HH.tbody []
            (map renderContent contents)
      ]
    ]
  where
  renderContent :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContent content =
    HH.tr [ css "item" ]
      [ HH.th [] 
          [ link NavigateRoute (User content.updaterUser.displayId UserMain)
              [ css "user" ]
              [ userIcon content.updaterUser ]
          ]
      , HH.th [] 
          [ link NavigateRoute (Container state.spaceDisplayId content.format.displayId)
              [ css "format" ]
              [ formatWithIcon content.format 
              ]
          ]
      , HH.th []
          [ link NavigateRoute (Content content.contentId)
              [ css "title" ]
              [ HH.text common.title ] 
          ]
      , HH.th [] 
          [ link NavigateRoute (Content content.contentId)
              [ css "timestamp" ]
              [ if content.updatedAt /= content.createdAt then
                  HH.text $ fromTimestampToElapsedTimeString content.updatedAt <> "に更新されました"
                else
                  HH.text $ fromTimestampToElapsedTimeString content.updatedAt <> "に作成されました"
              ] 
          ]
      ]
    where
    common = getContentSemanticData content.data content.format

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContents $ getSpaceLatestContents state.spaceId
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route
  FetchedContents fetch -> do
    forRemote fetch \contents->
      H.modify_ _ { contents = contents }