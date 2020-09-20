module Incentknow.Pages.Crawler.Main where

import Prelude

import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Crawler)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, submitButton)

type Input
  = { crawler :: Crawler }

type State
  = { crawler :: Crawler, editMode :: Boolean, updating :: Boolean }

data Action
  = Initialize
  | Edit
  | Discard
  | SubmitEdit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { crawler: input.crawler, editMode: false, updating: false }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ if not state.editMode then
        button "編集する" Edit
      else
        HH.text ""
    , if state.editMode then
        HH.div_
          [ submitButton
              { text: "更新する"
              , loadingText: "更新中"
              , isDisabled: state.updating
              , isLoading: state.updating
              , onClick: SubmitEdit
              }
          , button "変更を破棄" Discard
          ]
      else
        HH.text ""
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  Edit -> H.modify_ _ { editMode = true }
  Discard -> H.modify_ _ { editMode = false }
  SubmitEdit -> pure unit