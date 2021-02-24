module Incentknow.Pages.Format.Main where

import Prelude
import CSS (properties)
import Data.Either (Either(..))
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (updateFormatStructure)
import Incentknow.API.Execution (executeAPI)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, submitButton)
import Incentknow.Data.Entities (FocusedFormat)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.Data.Property (ChangeType(..), difference)
import Incentknow.Organisms.Structure as Structure

type Input
  = { format :: FocusedFormat }

type State
  = { format :: FocusedFormat, editMode :: Boolean, updating :: Boolean }

data Action
  = Initialize
  | Edit
  | Discard
  | SubmitEdit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( structure :: Structure.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { format: input.format, editMode: false, updating: false }

structure_ = SProxy :: SProxy "structure"

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ if not state.editMode then
        button "編集する" Edit
      else
        HH.text ""
    , HH.slot structure_ unit Structure.component { readonly: not state.editMode, spaceId: state.format.space.spaceId } absurd
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
  Initialize -> do
    state <- H.get
    let
      props = state.format.structure.properties
    _ <- H.query structure_ unit $ H.tell $ Structure.SetValue props
    pure unit
  Edit -> H.modify_ _ { editMode = true }
  Discard -> H.modify_ _ { editMode = false }
  SubmitEdit -> do
    state <- H.get
    H.query structure_ unit (H.request Structure.GetValue)
      >>= traverse_ \props -> do
          let
            diff = difference state.format.structure.properties props
          when (diff.changeType /= NoneChange) do
            H.modify_ _ { updating = true }
            result <- executeAPI $ updateFormatStructure state.format.formatId props
            case result of
              Just _ -> H.modify_ _ { updating = false, editMode = false, format { structure { properties = props } } }
              Nothing -> H.modify_ _ { updating = false }
