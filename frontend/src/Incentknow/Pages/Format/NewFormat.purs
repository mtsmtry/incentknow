module Incentknow.Pages.NewFormat where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (createFormat)
import Incentknow.API.Execution (executeCommand)
import Incentknow.AppM (class Behaviour, Message(..), message)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (FormatUsage(..), PropertyInfo)
import Incentknow.Data.Ids (SpaceId)
import Incentknow.Molecules.Form (define, defineText)
import Incentknow.Molecules.FormatUsageMenu as FormatUsageMenu
import Incentknow.Organisms.Structure as Structure
import Incentknow.Templates.Main (centerLayout)
import Incentknow.Templates.Page (creationPage)

type Input
  = { spaceId :: SpaceId }

type State
  = { spaceId :: SpaceId
    , displayName :: String
    , displayId :: String
    , description :: String
    , props :: Array PropertyInfo
    , loading :: Boolean
    , usage :: Maybe FormatUsage
    }

data Action
  = ChangeDisplayName String
  | ChangeDisplayId String
  | ChangeDescription String
  | ChangeUsage (Maybe FormatUsage)
  | Submit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( structure :: Structure.Slot Unit
    , usage :: FormatUsageMenu.Slot Unit
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
  { spaceId: input.spaceId
  , displayName: ""
  , displayId: ""
  , description: ""
  , usage: Just Internal
  , props: []
  , loading: false
  }

structure_ = SProxy :: SProxy "structure"

usage_ = SProxy :: SProxy "usage"

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout { leftSide: [], rightSide: [] }
    [ creationPage { title: "新しいフォーマットを作成する", desc: "フォーマットは、コンテンツの形式を定義します。また、そのコンテンツのページの形式やコンテンツの他の媒体からのインポートについて定義します。" }
      [ defineText { label: "名前", value: state.displayName, onChange: ChangeDisplayName }
      --, defineText { label: "ID", value: state.displayId, onChange: ChangeDisplayId }
      , defineText { label: "説明", value: state.description, onChange: ChangeDescription }
      --, defineText { label: "説明コンテンツ", value: state.descContentId, onChange: ChangeDescContentId }
      , define "フォーマットの使用用途"
          [ HH.slot usage_ unit FormatUsageMenu.component { value: state.usage, disabled: false } (Just <<< ChangeUsage) ]
      , define "テータ定義"
          [ HH.slot structure_ unit Structure.component { readonly: false, spaceId: state.spaceId } absurd ]
      , HH.div
          []
          [ submitButton
              { isDisabled: state.loading
              , isLoading: state.loading
              , loadingText: ""
              , text: "フォーマットを作成"
              , onClick: Submit
              }
          ]
      ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  ChangeDisplayName displayName -> H.modify_ _ { displayName = displayName }
  ChangeDisplayId displayId -> H.modify_ _ { displayId = displayId }
  ChangeDescription description -> H.modify_ _ { description = description }
  ChangeUsage usage -> H.modify_ _ { usage = usage }
  Submit -> do
    state <- H.get
    struct <- H.query structure_ unit (H.request Structure.GetValue)
    case struct, state.usage of
      Just props, Just usage -> do
        let
          newFormat =
            { displayName: state.displayName
            -- , displayId: state.displayId
            , description: state.description
            , properties: props
            , spaceId: state.spaceId
            , usage
            }
        H.modify_ _ { loading = true }
        response <- executeCommand $ createFormat newFormat
        for_ response \displayId -> do
          -- navigate $ Format displayId FormatMain
          message $ Success "フォーマットの作成に成功しました"
        H.modify_ _ { loading = false }
      Nothing, _ -> message $ Error "データ定義の入力が終わっていません"
      _, Nothing -> message $ Error "使用用途を入力してください"
