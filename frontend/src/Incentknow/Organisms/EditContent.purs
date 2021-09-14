module Incentknow.Organisms.EditContent where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Argonaut.Core (Json, jsonNull)
import Data.Array (length)
import Data.Foldable (for_)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (error)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Halogen.Query.HalogenM (SubscriptionId)
import Incentknow.API (commitContent, createNewContentDraft, editContentDraft, getContentDraft, getFocusedFormatByStructure, startContentEditing)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeCommand, forRemote)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..))
import Incentknow.Data.Entities (FocusedFormat, FocusedContentDraft)
import Incentknow.Data.Ids (ContentDraftId, SpaceId, StructureId)
import Incentknow.Data.Property (getDefaultValue)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Molecules.StructureMenu as StructureMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..))
import Incentknow.Templates.Page (section)
import Test.Unit.Console (consoleLog)

-- A type which defines the draft by three kind sources
type State
  = { -- the format and the value of the editor
      format :: Maybe FocusedFormat
    , value :: Json
    -- the save state
    , saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , target :: EditContentTarget
    , draft :: Remote FocusedContentDraft
    , draftInfo :: Maybe (Tuple (Maybe SpaceId) StructureId)
    , committed :: Boolean
    }

data Action
  = Initialize
  | Finalize
  | Load
  | HandleInput EditContentTarget
  | ChangeSpace (Maybe SpaceId)
  | ChangeStructure (Maybe StructureId)
  | ChangeValue Json
  | CheckChange Boolean
  | FetchedFormat (Fetch FocusedFormat)
  | FetchedDraft (Fetch FocusedContentDraft)
  | Commit

type Slot p
  = forall q. H.Slot q Output p

data Output 
  = CreatedDraft ContentDraftId
  | UpdatedDraft ContentDraftId Json

type ChildSlots
  = ( editor :: Editor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , structureMenu :: StructureMenu.Slot Unit
    )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditContentTarget Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , finalize = Just Finalize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: EditContentTarget -> State
initialState input =
  { format: Nothing
  , value: jsonNull
  , target: input
  , saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , draft: Loading
  , draftInfo: Nothing
  , committed: false
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-edit-content" ]
      [ -- HH.div [ css "save-state" ] [ saveState state.saveState ]
        section ("top" <> if isJust state.format then " top-with-info" else "")
          [ HH.div [ css "header" ]
            [ case state.target, state.draftInfo of
                TargetBlank spaceId structureId, _ ->
                    HH.div [ css "createto createto-blank" ]
                      [ HH.tr [ ]
                          [ HH.td [ css "type" ] [ HH.text "スペース" ]
                          , HH.td [ css "value" ]
                              [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                                  { value: spaceId, disabled: false }
                                  (Just <<< ChangeSpace)
                              ]
                          ]
                      , HH.tr [ ]
                          [ HH.td [ css "type" ] [ HH.text "フォーマット" ]
                          , HH.td [ css "value" ]
                              [ HH.slot (SProxy :: SProxy "structureMenu") unit StructureMenu.component
                                  { value: structureId, filter: maybe FormatMenu.None FormatMenu.SpaceBy spaceId, disabled: false }
                                  (Just <<< ChangeStructure)
                              ]
                          ]
                      ]
                _, Just (Tuple spaceId structureId) ->
                  HH.div [ css "createto createto-draft" ]
                    [ HH.tr [ ] 
                        [ HH.td [ css "type" ] [ HH.text "スペース" ]
                        , HH.td [ css "value" ]
                            [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                                { value: spaceId, disabled: true }
                                (Just <<< ChangeSpace)
                            ]
                        ]
                    , HH.tr [ ] 
                        [ HH.td [ css "type" ] [ HH.text "フォーマット" ]
                        , HH.td [ css "value" ]
                            [ HH.slot (SProxy :: SProxy "structureMenu") unit StructureMenu.component
                                { value: Just structureId, filter: maybe FormatMenu.None FormatMenu.SpaceBy spaceId, disabled: true }
                                (Just <<< ChangeStructure)
                            ]
                        ]
                    ]
                _, _ ->
                  remoteWith state.draft \draft->
                    HH.div [ css "createto createto-draft" ]
                      [ HH.tr [ ] 
                          [ HH.td [ css "type" ] [ HH.text "スペース" ]
                          , HH.td [ css "value" ]
                              [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                                  { value: Just draft.format.space.spaceId, disabled: true }
                                  (Just <<< ChangeSpace)
                              ]
                          ]
                      , HH.tr [ ] 
                          [ HH.td [ css "type" ] [ HH.text "フォーマット" ]
                          , HH.td [ css "value" ]
                              [ HH.slot (SProxy :: SProxy "structureMenu") unit StructureMenu.component
                                  { value: Just draft.format.currentStructure.structureId, filter: FormatMenu.SpaceBy draft.format.space.spaceId, disabled: true }
                                  (Just <<< ChangeStructure)
                              ]
                          ]
                      ]
            ]
          ]
      , maybeElem state.format \format ->
          HH.slot editor_ unit Editor.component
            { format: format
            , value: state.value
            , env:
                { spaceId:
                    case state.target of
                      TargetBlank spaceId structureId -> spaceId
                      _ -> Nothing
                }
            }
            (Just <<< ChangeValue)
      , case state.target, state.draft of
          TargetBlank _ _, _ -> HH.text ""
          TargetDraft _, Holding draft ->
            if draft.contentId == Nothing then
              submitButton
                { isDisabled: state.loading
                , isLoading: state.loading
                , text: "作成"
                , loadingText: "作成中"
                , onClick: Commit
                }
            else
              submitButton
                { isDisabled: state.loading
                , isLoading: state.loading
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Commit
                }
          TargetDraft _, _ ->
              submitButton
                { isDisabled: state.loading
                , isLoading: state.loading
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Commit
                }
          TargetContent _, _ ->
            submitButton
              { isDisabled: state.loading 
              , isLoading: state.loading
              , text: "変更"
              , loadingText: "変更中"
              , onClick: Commit
              }
      ]

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff
        $ forever do
            Aff.delay $ Milliseconds 2000.0
            EventSource.emit emitter $ CheckChange false
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> do
    liftEffect $ consoleLog "EditContent.HandleInput"
    state <- H.get
    when (state.target /= input) do
      handleAction $ CheckChange true
      H.put $ initialState input
      handleAction Load
  Finalize -> do
    H.liftEffect $ consoleLog "EditContent.Finalize start"
    handleAction $ CheckChange true
    H.liftEffect $ consoleLog "EditContent.Finalize end"
  Initialize -> do
    state <- H.get
    -- Load resources
    handleAction Load
    -- Subscrive a interval save timer
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  Load -> do
    state <- H.get
    case state.target of
      TargetBlank spaceId structureId -> do
        -- set the selected value
        H.modify_ _ { target = TargetBlank spaceId structureId }
        -- fetch the format
        for_ structureId \structureId2 ->
          callbackQuery FetchedFormat $ getFocusedFormatByStructure structureId2
      TargetDraft draftId -> do
        -- fetch the draft
        callbackQuery FetchedDraft $ getContentDraft draftId
      TargetContent contentId -> do
        -- get or create a draft of the specified content and fetch the draft id
        maybeDraftId <- executeCommand $ startContentEditing contentId Nothing
        for_ maybeDraftId \draftId -> do
          navigate $ EditDraft $ ContentTarget $ TargetDraft draftId
          H.raise $ CreatedDraft draftId
  -- Fetch
  FetchedFormat fetch -> do
    forRemote fetch \format ->
      H.modify_ _ { format = R.toMaybe format, value = fromMaybe jsonNull $ map getDefaultValue $ map _.currentStructure.properties $ R.toMaybe format }
  FetchedDraft fetch -> do
    forRemote fetch \draft ->
      H.modify_ _ { format = map _.format $ R.toMaybe draft, value = fromMaybe jsonNull $ map _.data $ R.toMaybe draft, draft = draft }
  -- Change
  ChangeSpace spaceId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      TargetBlank oldSpaceId structureId -> do
        H.modify_ _ { target = TargetBlank spaceId structureId }
        when (spaceId /= oldSpaceId) do
          navigate $ EditDraft $ ContentTarget $ TargetBlank spaceId structureId
      _ -> pure unit
  ChangeStructure structureId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      TargetBlank spaceId oldStructureId -> do
        H.modify_ _ { target = TargetBlank spaceId structureId }
        liftEffect $ consoleLog $ "EditContent.ChangeStructure.modify" <> (fromMaybe "" $ map (unwrap >>> show) spaceId) <> "," <> (fromMaybe "" $ map (unwrap >>> show) structureId)
        when (structureId /= oldStructureId) do
          navigate $ EditDraft $ ContentTarget $ TargetBlank spaceId structureId
      _ -> pure unit
    -- Reload the format
    H.modify_ _ { format = Nothing }
    for_ structureId \structureId2 -> do
      callbackQuery FetchedFormat $ getFocusedFormatByStructure structureId2
  ChangeValue value -> do
    state <- H.get
    -- Set the value and change the save state
    case state.saveState of
      Saving -> H.modify_ _ { value = value, saveState = SavingButChanged }
      _ -> H.modify_ _ { value = value, saveState = NotSaved }
    case state.target of
      TargetDraft draftId -> H.raise $ UpdatedDraft draftId value
      _ -> pure unit
  -- Save changes if they happened
  CheckChange includeMaterials -> do
    state <- H.get
    -- when active state for save
    when (not state.committed) do
      materials <- if includeMaterials then getMaterials else pure []
      when ((state.saveState == NotSaved && not state.loading) || length materials > 0) do
        for_ state.format \format -> do
          -- Set the save state
          H.modify_ _ { saveState = Saving }
          case state.target of
            TargetBlank spaceId structureId -> do
              for_ structureId \structureId2 -> do
                result <- executeCommand $ createNewContentDraft structureId2 spaceId state.value
                case result of
                  Just draftId -> do
                    pushState $ EditDraft $ ContentTarget $ TargetDraft draftId
                    H.modify_ _ { target = TargetDraft draftId, draftInfo = Just (Tuple spaceId structureId2) }
                    makeSaveStateSaved
                    H.raise $ CreatedDraft draftId
                  Nothing -> H.modify_ _ { saveState = NotSaved }
            TargetDraft draftId -> do
              result <- executeCommand $ editContentDraft draftId state.value materials
              case result of
                Just _ -> makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
            TargetContent _ -> pure unit
  Commit -> do
    state <- H.get
    case state.target of
      TargetDraft draftId -> do
        H.modify_ _ { loading = true, committed = true }
        materials <- getMaterials
        maybeContentId <- executeCommand $ commitContent draftId state.value materials
        for_ maybeContentId \contentId->
          navigate $ Content contentId
        --H.modify_ _ { loading = false }
      _ -> pure unit
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots Output m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }

  getMaterials = do
    maybeMaterialMap <- H.query editor_ unit $ H.request Editor.GetMaterialUpdations
    let 
      materialMap = fromMaybe M.empty maybeMaterialMap
      materials = map (\(Tuple id d)-> { draftId: id, data: d }) $ M.toUnfoldable materialMap
    pure materials
    