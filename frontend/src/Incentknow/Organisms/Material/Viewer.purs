module Incentknow.Organisms.Material.Viewer where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), split)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Data.Entities (MaterialData(..))
import Incentknow.Data.Property (MaterialObject(..), fromJsonToMaterialObject)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Document.Viewer as Document
import Incentknow.Route (Route)

type Input 
  = { value :: Json }

type State
  = { material :: MaterialObject
    }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( document :: Document.Slot Unit
    )

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
  { material: fromJsonToMaterialObject input.value
  }

editor_ = SProxy :: SProxy "editor"

getMaterialData :: MaterialObject -> Maybe MaterialData
getMaterialData = case _ of
  MaterialObjectDraft draft -> Just draft.data
  MaterialObjectFocused mat -> Just mat.data
  MaterialObjectRelated mat -> Nothing

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-material-viewer" ]
    [ case getMaterialData state.material of
        Just (DocumentMaterialData doc) ->
          HH.slot (SProxy :: SProxy "document") unit Document.component { value: doc } absurd    
        Just (PlaintextMaterialData text) ->
          renderText text
        _ -> HH.text "Error"
    ]

renderText :: forall m. String -> H.ComponentHTML Action ChildSlots m
renderText text =
  HH.div [ css "text" ] (map renderLine $ split (Pattern "\n") text)
  where
  renderLine line = HH.div [ css "line" ] [ HH.text line ]

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input