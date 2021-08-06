module Incentknow.Pages.Content where

import Prelude

import Data.Array (filter, head)
import Data.Foldable (for_)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContent)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forItem, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, Relation)
import Incentknow.HTML.Utils (css, link_, maybeElem)
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Organisms.RelatedContents as RelatedContents
import Incentknow.Organisms.UserCard as UserCard
import Incentknow.Route (ContentSpec(..), EditContentTarget(..), EditTarget(..), Route(..))
import Incentknow.Route as R
import Incentknow.Templates.Main (centerLayout)
import Incentknow.Templates.Page (section, tabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { contentSpec :: ContentSpec }

type State
  = { contentSpec :: ContentSpec
    , content :: Remote FocusedContent
    , tab :: String
    , relationalContents :: M.Map String (Remote (Array FocusedContent))
    , contentSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | ChangeContent (Fetch FocusedContent)
  | HandleInput Input
  | Navigate MouseEvent Route
  | NavigateRoute Route
  | ChangeTab String
  | FetchedRelationalContents String (Fetch (Array FocusedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit
    , userCard :: UserCard.Slot Unit
    , relatedContents :: RelatedContents.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            }
    }

initialState :: Input -> State
initialState input =
  { contentSpec: input.contentSpec
  , content: Loading
  , relationalContents: M.empty
  , tab: "main"
  , contentSubId: Nothing
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.content \content->
    centerLayout { leftSide: [], rightSide: [] }
      [ HH.div [ css "page-content" ]
        [ HH.slot (SProxy :: SProxy "content") unit Content.component { content } absurd
        , HH.div [] (map (renderRelation content) content.format.relations)
        ]
      ]
  where
  renderRelation :: FocusedContent -> Relation -> H.ComponentHTML Action ChildSlots m
  renderRelation content relation = 
    HH.slot (SProxy :: SProxy "relatedContents") unit RelatedContents.component 
      { spaceId: content.format.space.spaceId
      , value: unwrap content.contentId
      , relation
      }
      absurd

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.contentSubId \subId ->
      H.unsubscribe subId
    case state.contentSpec of
      ContentSpecContentId contentId -> do
        callbackQuery ChangeContent $ getContent contentId
       -- H.modify_ _ { contentSubId = Just contentSubId }
      ContentSpecSemanticId formatId semanticId -> do
        pure unit -- TODO
        -- callbackQuery ChangeContent $ onLoadContentBySemanticId formatId semanticId
  ChangeContent fetch -> do
    state <- H.get
    forItem fetch \content-> do
      case state.contentSpec of
        ContentSpecSemanticId formatId semanticId -> do
          pushState $ R.Content content.contentId
        ContentSpecContentId contentId -> pure unit
    forRemote fetch \content->
      H.modify_ _ { content = content }
  HandleInput input -> do
    state <- H.get 
    when (input.contentSpec /= state.contentSpec) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  NavigateRoute route -> navigate route
  FetchedRelationalContents tab fetch ->
    forRemote fetch \contents ->
      H.modify_ \x -> x { relationalContents = M.insert tab contents x.relationalContents }
  ChangeTab tab -> do
    state <- H.modify_ _ { tab = tab }
    if tab == "main" then do
      pure unit
    else do
      pure unit
      --let
     --   id = fromMaybe 0 (fromString tab)
      --for_ (toMaybe state.content) \content -> do
      --  pure unit
        --when (not (M.member tab state.relationalContents)) do
       --   for_ (index content.format.contentPage.relations id) \relation -> do
        --    pure unit
 --fetchAPI (FetchedRelationalContents tab) $ getContentsByQuery { formatId: relation.formatId, property: relation.property, contentId: content.contentId }