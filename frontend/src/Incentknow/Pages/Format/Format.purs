module Incentknow.Pages.Format where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFormat)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Entities (FocusedFormat)
import Incentknow.Data.Ids (FormatDisplayId)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Pages.Format.Main as Main
import Incentknow.Pages.Format.Setting as Setting
import Incentknow.Pages.Format.Versions as Versions
import Incentknow.Route (EditContentTarget(..), EditTarget(..), FormatTab(..), Route(..))
import Incentknow.Templates.Page (tabPage)

type Input
  = { formatId :: FormatDisplayId, tab :: FormatTab }

type State
  = { formatId :: FormatDisplayId, tab :: FormatTab, format :: Remote FocusedFormat }

data Action
  = Initialize
  | ChangeTab FormatTab
  | HandleInput Input
  | Navigate Route
  | Delete
  | FetchedFormat (Fetch FocusedFormat)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( main :: Main.Slot Unit
    --, page :: Page.Slot Unit
    , versions :: Versions.Slot Unit
    , delete :: DangerChange.Slot Unit
    , setting :: Setting.Slot Unit
    --, reactor :: Reactor.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
initialState input = { formatId: input.formatId, format: Loading, tab: input.tab }

--HH.slot (SProxy :: SProxy "delete") unit DangerChange.component
--                    { text: "削除"
--                    , title: "フォーマットの削除"
--                    , message: "フォーマット「" <> x.name <> "」" <> "を本当に削除しますか？"
--                    }
--                    (\_ -> Just Delete)
render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  tabPage
    { tabs:
        [ FormatMain, FormatPage, FormatVersions, FormatSetting ]
         -- <> if maybe false (\x -> x.generator == "reactor") (toMaybe state.format) then [ FormatReactor ] else []
    , currentTab: state.tab
    , onChangeTab: ChangeTab
    , showTab:
        case _ of
          FormatMain -> "Structure"
          FormatPage -> "Page"
          FormatVersions -> "Versions"
          FormatSetting -> "Setting"
          FormatReactor -> "Reactor"
    }
    [ maybeElem (toMaybe state.format) \x ->
        menuPositiveButton "コンテンツを作成" (Navigate $ EditDraft $ ContentTarget $ TargetBlank (Just x.space.spaceId) (Just x.currentStructure.structureId))
    ]
    [ remoteWith state.format \x ->
        HH.div [ css "page-format" ]
          [ HH.div [ css "name" ] [ HH.text x.displayName ]
          , HH.div [ css "desc" ] [ HH.text x.description ]
          ]
    ]
    [ remoteWith state.format \x -> case state.tab of
        FormatMain -> HH.slot (SProxy :: SProxy "main") unit Main.component { format: x } absurd
        FormatPage -> HH.text ""  -- HH.slot (SProxy :: SProxy "page") unit Page.component { format: x } absurd
        FormatVersions -> HH.slot (SProxy :: SProxy "versions") unit Versions.component { formatId: x.formatId } absurd
        FormatSetting -> HH.slot (SProxy :: SProxy "setting") unit Setting.component { format: x, disabled: false } absurd
        FormatReactor -> HH.text "" -- HH.slot (SProxy :: SProxy "reactor") unit Reactor.component { format: x } absurd  
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedFormat $ getFormat state.formatId
  FetchedFormat fetch -> do
    forRemote fetch \format ->
      H.modify_ _ { format = format }
  HandleInput input -> do
    state <- H.get
    if state.formatId /= input.formatId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ $ _ { tab = input.tab }
  ChangeTab tab -> do
    state <- H.get
    navigate $ Format state.formatId tab
  Navigate route -> navigate route
  Delete -> do
    state <- H.get
    -- response <- handleError $ client.formats.byId.delete { params: { id: state.formatId } }
    pure unit
