module Incentknow.Organisms.LatestContentListByFormat where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContents, getSpaceLatestContents)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (formatWithIcon, iconButton, iconSolid, remoteWith, userIcon)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent, RelatedFormat)
import Incentknow.Data.Ids (FormatId, SpaceId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.BoxView as BoxView
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..))
import Incentknow.Templates.Page (sectionWithHeader)

type Input
  = { spaceId :: SpaceId, format :: RelatedFormat }

type State
  = { spaceId :: SpaceId
    , format :: RelatedFormat
    , contents :: Remote (Array RelatedContent)
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate Route
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
  , format: input.format
  , contents: Loading
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-latest-contentlist-byformat"
    [ formatWithIcon state.format
    , HH.span [ css "creation" ] [ iconButton "far fa-plus-circle" (Navigate $ EditDraft $ ContentTarget $ TargetBlank (Just state.spaceId) (Just state.format.currentStructureId)) ]
    ]
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
      [ HH.th [] [ HH.span [ css "user" ] [ userIcon content.updaterUser ] ]
      , HH.th [] [ HH.span [ css "title" ] [ HH.text common.title ] ]
      , HH.th [] [ HH.span [ css "timestamp" ] [ dateTime content.updatedAt ] ]
      ]
    where
    common = getContentSemanticData content.data content.format
 
handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContents $ getContents state.spaceId state.format.formatId
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  FetchedContents fetch -> do
    forRemote fetch \contents->
      H.modify_ _ { contents = contents }