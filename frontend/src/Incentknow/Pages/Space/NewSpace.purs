module Incentknow.Pages.NewSpace where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (wrap)
import Data.String (length)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getAvailableSpaceDisplayId, createSpace)
import Incentknow.API.Execution (callAPI, callQuery, executeAPI, executeCommand)
import Incentknow.AppM (class Behaviour, Message(..), message, navigate)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Utils (generateId)
import Incentknow.Molecules.DisplayId (CheckState(..))
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Form (define, defineText)
import Incentknow.Route (Route(..), SpaceTab(..))
import Incentknow.Templates.Page (creationPage, section)

type Input
  = {}

type State
  = { displayName :: String
    , displayId ::
        { checkState :: CheckState
        , displayId :: String
        }
    , description :: String
    , loading :: Boolean
    }

data Action
  = Initialize
  | Submit
  | ChangeDisplayName String
  | ChangeDisplayId
    { checkState :: CheckState
    , displayId :: String
    }
  | ChangeDescription String

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( displayId :: DisplayId.Slot Unit )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { displayName: "", displayId: { displayId: "", checkState: Typing }, description: "", loading: false }

regulation_ = SProxy :: SProxy "regulation"

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  creationPage { title: "新しいスペースを作成する", desc: "スペースは、コンテンツとフォーマットを保持します。また、スペースではコンテンツとフォーマットの閲覧および編集の権限を管理するメンバーを保持します。" }
    [ defineText { label: "表示名", value: state.displayName, onChange: ChangeDisplayName }
    , define "ID"
        [ HH.slot (SProxy :: SProxy "displayId") unit DisplayId.component
            { checkId: callQuery <<< getAvailableSpaceDisplayId <<< wrap
            , disabled: false
            , value: state.displayId
            }
            (Just <<< ChangeDisplayId)
        ]
    , defineText { label: "説明", value: state.description, onChange: ChangeDescription }
    --    , HH.slot regulation_ unit SpaceRegulation.component { value: initialRegulation } absurd
    , submitButton
        { isDisabled: state.loading || state.displayId.checkState /= Available || length state.displayName == 0
        , isLoading: state.loading
        , loadingText: ""
        , text: "スペースを作成"
        , onClick: Submit
        }
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    displayId <- generateId 12
    H.modify_ _ { displayId = { displayId, checkState: Available } }
  ChangeDisplayName displayName -> H.modify_ _ { displayName = displayName }
  ChangeDisplayId displayId -> H.modify_ _ { displayId = displayId }
  ChangeDescription description -> H.modify_ _ { description = description }
  Submit -> do
    state <- H.modify _ { loading = true }
    -- regulation <- H.query regulation_ unit (H.request SpaceRegulation.GetValue)
    response <-
      executeCommand
        $ createSpace
            { displayId: state.displayId.displayId
            , displayName: state.displayName
            , description: state.description
            }
    for_ response \displayId -> do
      navigate $ Space displayId SpaceContainers
      message $ Success "スペースの作成に成功しました"
    H.modify_ _ { loading = false }
