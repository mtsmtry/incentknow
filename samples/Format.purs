module Incentknow.Pages.Format where

import CSS.Helper
import CSS.Common as CSSC
import CSS.Cursor as Cursor
import Data.Maybe (Maybe(..))
import Prelude
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.CSS (style)
import Incentknow.Route as R
import Incentknow.Api (client, call, Format)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Templates.Entity (entity)
import Control.Monad ((*>))
import Effect.Aff.Class (class MonadAff)

type Input
  = { formatId :: String }

type State
  = { format :: Maybe Format }

data Action
  = Initialize String

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval (H.defaultEval { receive = \x -> Just $ Initialize x.formatId, handleAction = handleAction })
    }

initialState :: Input -> State
initialState input = { format: Nothing }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  maybeElem state.format \format->
    HH.div_ [ HH.text format.format.name ]

handleAction :: forall o m. MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Initialize formatId -> do
    format <- H.liftAff $ call (client.formats.byId.get { params: { id: formatId } })
    H.modify_ (_ { format = Just format })