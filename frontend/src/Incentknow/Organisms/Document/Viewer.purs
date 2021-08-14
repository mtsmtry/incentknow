module Incentknow.Organisms.Document.Viewer where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (Document, DocumentBlock)
import Incentknow.Data.Ids (DocumentBlockId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Document.BlockViewer as Block

type Input
  = { value :: Document }

type State
  = { document :: Document }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( block :: Block.Slot DocumentBlockId )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
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
initialState input =
  { document: input.value
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-document org-document-viewer" ]
    [ HH.div 
        [ css "blocks"
        ]
        (map renderBlock state.document.blocks)
    ]
  where
  renderBlock :: DocumentBlock -> H.ComponentHTML Action ChildSlots m
  renderBlock block = HH.slot (SProxy :: SProxy "block") block.id Block.component { value: block } (\_-> Nothing)

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input