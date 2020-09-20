module Incentknow.Organisms.FormatRegulation where

import Prelude

import Data.Array (mapWithIndex)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (allJust)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Ids (FormatId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu

type Input
  = { value :: Array FormatRegulation }

type Item
  = { formatId :: Maybe FormatId }

type State
  = { formats :: Array Item }

data Authority
  = Write

data Action
  = ChangeFormat Int (Maybe FormatId)
  | AddFormat

data Query a
  = GetValue (Array FormatRegulation -> a)

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Int )

component :: forall o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML Query Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction, handleQuery = handleQuery }
    }

initialState :: Input -> State
initialState input = { formats: map (\x -> { formatId: Just x.formatId }) input.value }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-format-authority" ]
    [ HH.div
        [ css "buttons-area" ]
        [ button "追加" AddFormat ]
    , HH.table_
        [ HH.thead
            []
            [ HH.tr []
                [ HH.th [] [ HH.text "フォーマット" ]
                , HH.th [] [ HH.text "" ]
                ]
            ]
        , HH.tbody
            []
            (mapWithIndex property state.formats)
        ]
    ]
  where
  property :: Int -> Item -> H.ComponentHTML Action ChildSlots m
  property index src =
    HH.tr
      []
      [ HH.td []
          [ HH.slot (SProxy :: SProxy "formatMenu") index FormatMenu.component { value: src.formatId, filter: FormatMenu.None } (Just <<< ChangeFormat index)
          , HH.td []
              []
          ]
      ]

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  AddFormat -> H.modify_ (\x -> x { formats = x.formats <> [ { formatId: Nothing } ] })
  ChangeFormat trgIndex formatId -> H.modify_ (\x -> x { formats = mapWithIndex modifyFormat x.formats })
    where
    modifyFormat index format = if index == trgIndex then format { formatId = formatId } else format

buildRegulation :: Item -> Maybe FormatRegulation
buildRegulation item = case item.formatId of
  Just formatId -> Just { formatId: formatId }
  Nothing -> Nothing

handleQuery :: forall o m a. MonadEffect m => Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    let props = allJust $ map buildRegulation state.formats
    pure $ map k props
