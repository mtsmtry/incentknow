module Incentknow.Organisms.DraftExplorer where

import Prelude

import Data.Array (catMaybes, foldr)
import Data.Array as A
import Data.Map.Internal as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getMyContentDrafts)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (icon, remoteWith)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedFormat, RelatedContentDraft)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { }

type State
  = { drafts :: Remote (Array (RelatedContentDraft))
    }

type DraftSet
  = { format :: FocusedFormat
    , drafts :: Array (RelatedContentDraft)
    }

toDraftSets :: Array (RelatedContentDraft) -> Array DraftSet
toDraftSets drafts = catMaybes $ map (\(Tuple k v)-> map (\f-> { format: f, drafts: v }) $ M.lookup k formats) $ M.toUnfoldable draftsByFormat
  where
  draftsByFormat = foldr (\x-> M.alter (\v-> Just $ maybe [x] (\v2-> v2 <> [x]) v) x.format.formatId) M.empty drafts
  formatIds = A.fromFoldable $ M.keys formats
  formats = M.fromFoldable $ map (\x-> Tuple x.format.formatId x.format) drafts

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedDrafts (Fetch (Array RelatedContentDraft))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { drafts: Loading }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-draft-explorer" ] 
    [ remoteWith state.drafts \drafts-> 
        HH.div [ css "box" ]
          (map renderDraftSet $ toDraftSets drafts)
    ]
  where
  renderDraftSet :: DraftSet -> H.ComponentHTML Action ChildSlots m
  renderDraftSet item =
    HH.div [ css "draft-set" ]
      [ link Navigate (EditDraft $ ContentTarget $ TargetBlank (Just item.format.space.spaceId) (Just item.format.currentStructure.structureId))
          [ css "item" ] [ icon "fas fa-caret-down", HH.text $ item.format.space.displayName <> " - " <> item.format.displayName ]
      , HH.div [ css "drafts" ]
          (map renderDraft item.drafts)
      ]

  renderDraft :: RelatedContentDraft -> H.ComponentHTML Action ChildSlots m
  renderDraft draft =
    HH.div [ css "draft" ]
      [ link Navigate (EditDraft $ ContentTarget $ TargetDraft draft.draftId) []
          [ HH.text "draft" -- common.title 
          ]
      ]
    where
    common = getContentSemanticData draft.data draft.format

handleAction :: forall o s m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> callbackQuery FetchedDrafts $ getMyContentDrafts
  HandleInput props -> pure unit
  Navigate event route -> navigateRoute event route
  FetchedDrafts fetch -> do
    forRemote fetch \drafts->
      H.modify_ _ { drafts = drafts }