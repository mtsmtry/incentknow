module Incentknow.Organisms.LatestContentListByFormat where

import Prelude

import Data.Array (slice)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContents)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, icon, iconButton, remoteWith, userIcon)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent, RelatedFormat)
import Incentknow.Data.Ids (SpaceDisplayId, SpaceId)
import Incentknow.HTML.DateTime (dateTime, elapsedTime)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..), UserTab(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, format :: RelatedFormat }

type State
  = { spaceId :: SpaceId
    , spaceDisplayId :: SpaceDisplayId
    , format :: RelatedFormat
    , contents :: Remote (Array RelatedContent)
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedContents (Fetch (Array RelatedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , listView :: ListView.Slot Unit
    , dataGridView :: DataGridView.Slot Unit
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
  , format: input.format
  , contents: Loading
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-latest-contentlist-byformat"
    [ link Navigate (Container state.spaceDisplayId state.format.displayId)
        [] [ formatWithIcon state.format ]
    , HH.span [ css "creation" ] 
        [ link Navigate (EditDraft $ ContentTarget $ TargetBlank (Just state.spaceId) (Just state.format.currentStructureId))
            [ css "creation" ] [ icon "far fa-plus-circle" ]
        ]
    ]
    [ HH.table_
      [ remoteWith state.contents \contents->
          HH.tbody []
            (map renderContent $ slice 0 5 contents)
      ]
    ]
  where
  renderContent :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContent content =
    HH.tr [ css "item" ]
      [ HH.th []
          [ link Navigate (User content.updaterUser.displayId UserMain)
              [ css "user" ]
              [ userIcon content.updaterUser ]
          ]
      , HH.th []
          [ link Navigate (Content content.contentId)
              [ css "title" ]
              [ HH.text common.title ] 
          ]
      , HH.th []
          [  link Navigate (Content content.contentId)
              [ css "timestamp" ]
              [ elapsedTime content.updatedAt ] 
          ]
      ]
    where
    common = getContentSemanticData content.data content.format
 
handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContents $ getContents state.spaceId state.format.formatId
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
  FetchedContents fetch -> do
    forRemote fetch \contents->
      H.modify_ _ { contents = contents }