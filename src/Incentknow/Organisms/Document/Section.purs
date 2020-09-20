module Incentknow.Organisms.Document.Section where

import Prelude

import Data.Argonaut.Core (Json, jsonNull)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), isJust)
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Api (Format, getFormat)
import Incentknow.Api.Utils (executeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Document (Section)
import Incentknow.Data.Ids (ContentId, FormatId(..))
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.AceEditor as AceEditor
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.Content.Common (EditEnvironment, EditorInput)

data ContentComponent
  = ContentComponent (forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditorInput Json m)

type Input
  = { value :: Section, env :: EditEnvironment, contentComponent :: ContentComponent }

type State
  = { section :: Section, env :: EditEnvironment, contentComponent :: ContentComponent, formatId :: Maybe FormatId, format :: Maybe Format }

data Action
  = Initialize
  | HandleInput Input
  | ChangeMode String
  | ChangeFormat (Maybe FormatId)
  | ChangeText String
  | ChangeContent Json

type Slot p
  = forall q. H.Slot q Output p

type Output
  = Section

type ChildSlots
  = ( aceEditor :: AceEditor.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
    , content :: forall q. H.Slot q Json Unit
    )

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
initialState input = { section: input.value, env: input.env, formatId: Nothing, format: Nothing, contentComponent: input.contentComponent }

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.div_
        [ HH.span [ HE.onClick $ \_ -> Just $ ChangeMode "text" ] [ HH.text "テキスト" ]
        , HH.span [ HE.onClick $ \_ -> Just $ ChangeMode "content" ] [ HH.text "メディア" ]
        ]
    , case state.section.type of
        "content" ->
          HH.div_
            [ HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: FormatMenu.None, disabled: false } (Just <<< ChangeFormat)
            , maybeElem state.format \format ->
                HH.slot (SProxy :: SProxy "content") unit (getComponent state.contentComponent) { format: format, value: jsonNull, env: state.env } (Just <<< ChangeContent)
            ]
        _ ->
          HH.slot (SProxy :: SProxy "aceEditor") unit AceEditor.component
            { value: "", language: Nothing, variableHeight: true, readonly: false }
            (Just <<< ChangeText)
    ]
  where
  getComponent :: ContentComponent -> forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditorInput Json m
  getComponent (ContentComponent x) = x

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
  ChangeMode mode -> do
    state <- H.modify _ { section { type = mode } }
    H.raise state.section
  ChangeFormat formatId -> do
    H.modify_ _ { formatId = formatId }
    state <- H.get
    for_ formatId \formatId -> do
      when (state.formatId /= Just formatId) do
        H.modify_ _ { format = Nothing }
        --format <- executeApi $ getFormat formatId
        --H.modify_ _ { format = format }
  ChangeText text -> do
    state <- H.modify _ { section { data = encodeJson text } }
    H.raise state.section
  _ -> pure unit
