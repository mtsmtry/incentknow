module Incentknow.Organisms.Content where

import Prelude

import CSS (properties)
import Data.Argonaut.Core (fromString, toObject)
import Data.Either (Either)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Foreign (MultipleErrors)
import Foreign.Object as F
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.CSS (style)
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (call, client)
import Incentknow.AppM (class Behavior, navigate)
import Incentknow.Atoms.Textbox (textarea)
import Incentknow.Data.Format (Property)
import Incentknow.HTML.Utils (css)
import Incentknow.Route (Route(..))
import Simple.JSON (readJSON)

type Input
  = {}

type State
  = { props :: Array Property }

data Action
  = ChangeName String String

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. Behavior m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval (H.defaultEval { handleAction = handleAction })
    }

initialState :: Input -> State
initialState input = 
  case toObject $ fromString input.value of
    Just obj ->
      { props: [] }--Map.fromFoldable $ (F.toUnfoldable obj :: Array _)
    Nothing ->
      { props: [] }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.table
    [ css "org-structure" ]
    [ HH.thead
        []
        [ HH.tr []
            [ HH.th [] []
            , HH.th [] [ HH.text "名前" ]
            , HH.th [] [ HH.text "型" ]
            ]
        ]
    , HH.tbody
        []
        (map property state.props)
    ]
  where
  property :: Property -> H.ComponentHTML Action () m
  property prop =
    HH.tr
      []
      [ HH.td [] []
      , HH.td []
          [ textarea
              { value: prop.name
              , placeholder: ""
              , onChange: ChangeName prop.id
              }
          ]
      , HH.td []
          []
      ]

handleAction :: forall o m. MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  ChangeName id name -> do
    H.modify_ (\x -> x { props = modifyProp id (_ { name = name }) x.props })
  where
  modifyProp :: String -> (Property -> Property) -> Array Property -> Array Property
  modifyProp id modify = map (\x -> if x.id == id then modify x else x)
