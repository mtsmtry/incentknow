module Incentknow.Pages.Format.Page where

import Prelude
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Format, Structure, getFormatStructures, setFormatCollectionPage, setFormatContentPage)
import Incentknow.Api.Execution (executeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Ids (FormatId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting (ChangingState(..), renderSubmitButton)
import Incentknow.Molecules.Setting as Setting
import Incentknow.Organisms.CollectionPage as CollectionPage
import Incentknow.Organisms.ContentPage as ContentPage
import Incentknow.Organisms.Structure as Structure

type Input
  = { format :: Format }

type State
  = { format :: Format
    , contentPageState :: ChangingState
    , collectionPageState :: ChangingState
    }

data Action
  = Initialize
  | HandleInput Input
  | EditContentPage
  | EditCollectionPage
  | SubmitContentPage
  | SubmitCollectionPage
  | CancelContentPage
  | CancelCollectionPage

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentPage :: ContentPage.Slot Unit
    , collectionPage :: CollectionPage.Slot Unit
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
initialState input = { format: input.format, contentPageState: None, collectionPageState: None }

contentPage_ = SProxy :: SProxy "contentPage"

collectionPage_ = SProxy :: SProxy "collectionPage"

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-format-page" ]
    [ HH.div [ css "part" ]
        [ HH.div [ css "title" ]
            [ HH.text "コンテンツページ"
            , if state.contentPageState == None then
                button "編集" EditContentPage
              else
                renderSubmitButton state.contentPageState SubmitContentPage CancelContentPage false
            ]
        , HH.slot contentPage_ unit ContentPage.component
            { spaceId: state.format.spaceId, formatId: state.format.formatId, readonly: state.contentPageState /= Changing }
            absurd
        ]
    , HH.div [ css "part" ]
        [ HH.div [ css "title" ]
            [ HH.text "一覧ページ"
            , if state.collectionPageState == None then
                button "編集" EditCollectionPage
              else
                renderSubmitButton state.collectionPageState SubmitCollectionPage CancelCollectionPage false
            ]
        , HH.slot collectionPage_ unit CollectionPage.component
            { readonly: state.collectionPageState /= Changing }
            absurd
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    _ <- H.query contentPage_ unit $ H.tell $ ContentPage.SetValue state.format.contentPage
    _ <- H.query collectionPage_ unit $ H.tell $ CollectionPage.SetValue state.format.collectionPage
    pure unit
  HandleInput input -> do
    --H.put $ initialState input
    handleAction Initialize
  EditContentPage -> H.modify_ _ { contentPageState = Changing }
  EditCollectionPage -> H.modify_ _ { collectionPageState = Changing }
  CancelContentPage -> do
    state <- H.get
    _ <- H.query contentPage_ unit $ H.tell $ ContentPage.SetValue state.format.contentPage
    H.modify_ _ { contentPageState = None }
  CancelCollectionPage -> do
    state <- H.get
    _ <- H.query collectionPage_ unit $ H.tell $ CollectionPage.SetValue state.format.collectionPage
    H.modify_ _ { collectionPageState = None }
  SubmitContentPage -> do
    state <- H.get
    H.query contentPage_ unit (H.request ContentPage.GetValue)
      >>= traverse_ \contentPage -> do
          H.modify_ _ { contentPageState = Sending }
          _ <- executeApi $ setFormatContentPage state.format.formatId contentPage
          H.modify_ _ { contentPageState = None }
  SubmitCollectionPage -> do
    state <- H.get
    H.query collectionPage_ unit (H.request CollectionPage.GetValue)
      >>= traverse_ \collectionPage -> do
          H.modify_ _ { collectionPageState = Sending }
          _ <- executeApi $ setFormatCollectionPage state.format.formatId collectionPage
          H.modify_ _ { collectionPageState = None }
