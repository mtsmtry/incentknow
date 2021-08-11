module Incentknow.Organisms.Document.BlockEditor where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap)
import Data.String (Pattern(..), Replacement(..), length, replace, replaceAll)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (RefLabel(..), getHTMLElementRef)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (BlockData(..), DocumentBlock)
import Incentknow.Data.EntityUtils (getBlockDataOptions)
import Incentknow.Data.Ids (DocumentBlockId)
import Incentknow.HTML.Utils (css, whenElem)
import Web.Event.Event (cancelable, preventDefault, stopPropagation)
import Web.HTML (HTMLElement, HTMLTextAreaElement)
import Web.HTML.HTMLElement (contentEditable, setContentEditable)
import Web.HTML.HTMLTextAreaElement (fromHTMLElement, selectionStart)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, toEvent)

type Input
  = { value :: DocumentBlock }

type State
  = { data ∷ BlockData, id ∷ DocumentBlockId, initial :: Boolean }

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
initialState input = { id: input.value.id, data: input.value.data, initial: true }

foreign import autosize :: HTMLElement -> Effect Unit

foreign import getInnerText :: HTMLElement -> Effect String

foreign import setInnerText :: String -> HTMLElement -> Effect Unit

foreign import isFocused :: HTMLTextAreaElement -> Effect Boolean

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div 
    [ css "org-document-block"
    , HH.attr (HH.AttrName "data-id") $ unwrap state.id
    ]
    [ case state.data of
        ParagraphBlockData text ->
          HH.div
            [ css "paragraph"
            , HP.ref $ RefLabel $ unwrap state.id
            , HH.attr (HH.AttrName "data-editable") "true"
            ] 
            [ whenElem state.initial \_->
                HH.text $ toHtmlText text 
            ]
        HeaderBlockData level text ->
          HH.div
            [ css $ "header header-level" <> show level
            , HP.ref $ RefLabel $ unwrap state.id
            , HH.attr (HH.AttrName "data-editable") "true" 
            ]
            [ whenElem state.initial \_->
                HH.text $ toHtmlText text 
            ] 
    ]

toHtmlText :: String -> String
toHtmlText str = replaceAll (Pattern space2) (Replacement "&nbsp;") $ replaceAll (Pattern space1) (Replacement "&nbsp;") str
  where
  space1 = " "
  space2 = " "
    
handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    maybeElement <- getHTMLElementRef $ RefLabel $ unwrap state.id
    for_ maybeElement \element-> do
      for_ ((getBlockDataOptions state.data).text) \text->
        H.liftEffect $ setInnerText (toHtmlText text) element
  HandleInput input -> do
    state <- H.get
    when (state.data /= input.value.data) do
      H.put $ (initialState input) { initial = false }
      handleAction Initialize