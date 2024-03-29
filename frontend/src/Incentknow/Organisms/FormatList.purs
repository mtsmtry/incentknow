module Incentknow.Organisms.FormatList where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API (getContainers, getFormats)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote, zip)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, icon, iconButton, remoteArrayWith, remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Entities (FocusedContainer, RelatedFormat)
import Incentknow.Data.Ids (FormatDisplayId, SpaceDisplayId, SpaceId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, maybeElem)
import Incentknow.Route (EditContentTarget(..), EditTarget(..), FormatTab(..), Route(..), SpaceTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { spaceId :: SpaceId
    , spaceDisplayId :: SpaceDisplayId
    , selectedFormatid :: Maybe FormatDisplayId
    }

type State
  = { spaceId :: SpaceId
    , spaceDisplayId :: SpaceDisplayId
    , containers :: Remote (Array FocusedContainer)
    , formats :: Remote (Array RelatedFormat)
    , selectedFormatid :: Maybe FormatDisplayId
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | Navigate2 Route
  | FetchedContainers (Fetch (Array FocusedContainer))
  | FetchedFormats (Fetch (Array RelatedFormat))

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
initialState input = 
  { spaceId: input.spaceId
  , spaceDisplayId: input.spaceDisplayId
  , containers: Loading
  , formats: Loading
  , selectedFormatid: input.selectedFormatid
  }

zipContainerAndFormat :: Array FocusedContainer -> Array RelatedFormat -> Array (Tuple (Maybe FocusedContainer) (Maybe RelatedFormat))
zipContainerAndFormat containers formats = map (\x-> Tuple (M.lookup x containerMap) (M.lookup x formatMap)) formatIds
  where
  formatIds = S.toUnfoldable $ S.fromFoldable $ (map _.format.formatId containers) <> (map _.formatId formats)
  containerMap = M.fromFoldable $ map (\x-> Tuple x.format.formatId x) containers
  formatMap = M.fromFoldable $ map (\x-> Tuple x.formatId x) formats

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-format-list" ]
    [ HH.table_ 
        [ HH.thead []
            [ HH.td [] [ HH.text "Name" ]
            , HH.td [] [ HH.text "Information" ]
            , HH.td [] [ HH.text "Last Updated" ]
            , HH.td [ css "last" ] 
                [ link Navigate (NewFormat state.spaceId)
                    [ css "creation" ] [ HH.text "新しいフォーマット ", icon "fas fa-plus-circle" ]
                ]
            ]
        , remoteArrayWith (map (\(Tuple containers formats)-> zipContainerAndFormat containers formats) $ zip state.containers state.formats) \items->
            HH.tbody [] (map renderItem items)
        ]
    ]
  where
  renderItem :: Tuple (Maybe FocusedContainer) (Maybe RelatedFormat) -> H.ComponentHTML Action ChildSlots m
  renderItem (Tuple maybeContainer internalFormat) =
    HH.tr [ css "item" ] 
      [ HH.th []
          [ case maybeContainer, maybeFormat of
              Just container, _ ->
                link Navigate (Container container.space.displayId container.format.displayId)
                  [ css "name" ] 
                  [ formatWithIcon container.format 
                  ]
              _, Just format ->
                HH.span [ css "name" ] 
                  [ formatWithIcon format 
                  ]
              _, _ -> HH.text ""
          ]
      , HH.th []
          [ maybeElem maybeContainer \container->
              HH.span [ css "info" ] [ HH.text $ show container.contentCount <> "件のコンテンツ" ]
          ]
      , HH.th []
          [ maybeElem maybeContainer \container->
              maybeElem container.latestUpdatedAt \timestamp->
                HH.span [ css "timestamp" ] [ dateTime timestamp ]
          ]
      , HH.th [ css "icons" ]
          [ maybeElem internalFormat \format->
              link Navigate (Space state.spaceDisplayId $ SpaceFormat format.displayId FormatMain)  
                [ css $ "setting" <> if Just format.displayId == state.selectedFormatid then " selected-setting" else "" ] [ icon "fas fa-cog" ]
          , maybeElem maybeFormat \format->
              link Navigate (EditDraft $ ContentTarget $ TargetBlank (Just state.spaceId) (Just format.currentStructureId))
                [ css "creation" ] [ icon "far fa-plus-circle" ]
          ]
      ]
    where
    maybeFormat = if internalFormat == Nothing then map _.format maybeContainer else internalFormat

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContainers $ getContainers state.spaceId
    callbackQuery FetchedFormats $ getFormats state.spaceId
  HandleInput input -> do
    state <- H.get
    H.modify_ _ { selectedFormatid = input.selectedFormatid }
    when (state.spaceId /= input.spaceId) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  Navigate2 route -> navigate route
  FetchedContainers fetch -> do
    forRemote fetch \containers ->
      H.modify_ _ { containers = containers }
  FetchedFormats fetch -> do
    forRemote fetch \formats ->
      H.modify_ _ { formats = formats }