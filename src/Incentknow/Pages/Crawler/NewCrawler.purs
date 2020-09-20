module Incentknow.Pages.NewCrawler where

import Prelude
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (createCrawler)
import Incentknow.Api.Utils (executeApi)
import Incentknow.AppM (class Behaviour, Message(..), message, navigate)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Ids (SpaceId(..), ContentId(..), FormatId(..))
import Incentknow.Data.Property (Property, PropertyInfo)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.ContentMenu as ContentMenu
import Incentknow.Molecules.Form (define, defineText)
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Structure as Structure
import Incentknow.Route (CrawlerTab(..), Route(..))
import Incentknow.Templates.Entity (entity)
import Incentknow.Templates.Page (creationPage)

type Input
  = {}

type State
  = { contentId :: Maybe ContentId
    , spaceId :: Maybe SpaceId
    , displayName :: String
    , loading :: Boolean
    }

data Action
  = ChangeContentId (Maybe ContentId)
  | ChangeSpaceId (Maybe SpaceId)
  | ChangeDisplayName String
  | Submit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentMenu :: ContentMenu.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { contentId: Nothing
  , spaceId: Nothing
  , displayName: ""
  , loading: false
  }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  creationPage { title: "新しいクローラーの作成", desc: "クローラーは、インターネット上からコンテンツを収集する定期実行プログラムです" }
    [ defineText { label: "名前", value: state.displayName, onChange: ChangeDisplayName }
    , define "対象スペース"
        [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component { value: state.spaceId, disabled: false } (Just <<< ChangeSpaceId) ]
    , define "定義"
        [ HH.slot (SProxy :: SProxy "contentMenu") unit ContentMenu.component { value: state.contentId, formatId: FormatId "sTfFGce9xxMU", spaceId: state.spaceId, disabled: false } (Just <<< ChangeContentId) ]
    , HH.div
        []
        [ submitButton
            { isDisabled: isNothing state.contentId || isNothing state.spaceId || state.displayName == "" || state.loading
            , isLoading: state.loading
            , loadingText: ""
            , text: "クローラーを作成"
            , onClick: Submit
            }
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  ChangeContentId x -> H.modify_ _ { contentId = x }
  ChangeSpaceId x -> H.modify_ _ { spaceId = x }
  ChangeDisplayName x -> H.modify_ _ { displayName = x }
  Submit -> do
    state <- H.get
    for_ state.contentId \contentId -> do
      for_ state.spaceId \spaceId -> do
        let
          newCrawler = { contentId, spaceId }
        H.modify_ _ { loading = true }
        result <- executeApi $ createCrawler { definitionId: contentId, spaceId: spaceId, displayName: state.displayName }
        H.modify_ _ { loading = false }
        for_ result \crawlerId ->
          navigate $ Crawler crawlerId CrawlerMain
        
