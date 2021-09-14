module Incentknow.Organisms.Document.BlockViewer where

import Prelude

import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), Replacement(..), replaceAll)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (BlockData(..), DocumentBlock)
import Incentknow.Data.Ids (DocumentBlockId)
import Incentknow.HTML.Utils (css)

type Input
  = { value :: DocumentBlock }

type State
  = { data ∷ BlockData, id ∷ DocumentBlockId }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Output p

data Output
  = ChangeData BlockData
  | CreateBlock
  | MoveUpBlock
  | MoveDownBlock

type ChildSlots
  = ()

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = { id: input.value.id, data: input.value.data }

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div 
    [ css "org-document-block org-document-block-viewer"
    ]
    [ case state.data of
        ParagraphBlockData text ->
          HH.div
            [ css "paragraph"
            ] 
            [ HH.text $ toHtmlText text 
            ]
        HeaderBlockData level text ->
          HH.div
            [ css $ "header header-level" <> show level
            ]
            [ HH.text $ toHtmlText text 
            ] 
    ]

toHtmlText :: String -> String
toHtmlText str = replaceAll (Pattern space2) (Replacement "&nbsp;") $ replaceAll (Pattern space1) (Replacement "&nbsp;") str
  where
  space1 = " "
  space2 = " "
  
handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input