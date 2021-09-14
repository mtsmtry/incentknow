module Incentknow.Organisms.SearchView where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Array (catMaybes, filter, head)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.String (joinWith)
import Data.String as S
import Data.String.CodeUnits (splitAt)
import Data.Symbol (SProxy(..))
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Exception (error)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Halogen.Query.HalogenM (SubscriptionId)
import Incentknow.API (getSearchedAllContents, getSearchedContentsInContainer)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, propertyIcon, remoteArrayWith, remoteWith, userPlate)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (SearchedContent)
import Incentknow.Data.Ids (ContainerId, ContentId, FormatDisplayId, FormatId, SpaceDisplayId, SpaceId)
import Incentknow.Data.Property (MaterialObject(..), Property, ReferenceValue(..), TypedValue(..), fromJsonToMaterialObject, mkProperties, toTypedValue)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.RawHTML as RawHtml
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route(..), UserTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

data SearchQuery
  = SearchAllQuery String
  | SearchByContainerQuery SpaceDisplayId FormatDisplayId String

derive instance eqSearchQuery :: Eq SearchQuery 

type Input
  = { value :: SearchQuery
    }

type State
  = { query :: SearchQuery
    , items :: Remote (Array SearchedContent)
    , timerSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedContent (Fetch (Array SearchedContent))
  | Load

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( rawHtml :: RawHtml.Slot ContentId )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval 
        { initialize = Just Initialize
        , receive = Just <<< HandleInput
        , handleAction = handleAction
        }
    }

initialState :: Input -> State
initialState input = { query: input.value, items: Loading, timerSubId: Nothing }

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff
        $ forever do
            Aff.delay $ Milliseconds 300.0
            EventSource.emit emitter $ Load
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-search-view" ]
    [ remoteArrayWith state.items \items->
        HH.div [ css "result" ]
          (map renderItem items)
    ]
  where
  renderItem :: SearchedContent -> H.ComponentHTML Action ChildSlots m
  renderItem item =
    HH.div [ css "item" ]
      [ HH.div [ css "top" ]
          [ HH.div [ css "user" ]
              [ link Navigate (User item.content.creatorUser.displayId UserMain) 
                  []
                  [ userPlate item.content.creatorUser ]
              ]
          , HH.div [ css "title" ]
              [ link Navigate (Content item.content.contentId)
                  []
                  [ HH.text semantic.title ]
              ]
          , case state.query of
              SearchAllQuery _ ->
                HH.div [ css "format" ]
                  [ link Navigate (Container item.content.format.space.displayId item.content.format.displayId)
                      []
                      [ formatWithIcon item.content.format ]
                  ]
              _ -> HH.text ""
          ]
      , HH.div [ css "info" ] [
          HH.div [ css "properties" ] (map renderProperty properties),
          HH.div [ css "timestamp" ] [ dateTime item.content.createdAt ]
      ]
      , HH.div [ css "highlight" ]
          [ HH.slot (SProxy :: SProxy "rawHtml") item.content.contentId RawHtml.component
              { html: joinWith "..." item.highlights
              }
              absurd
          ]
      ]
    where
    properties =
      catMaybes
      $ map (\prop-> map (\str-> { str, prop }) $ showProperty prop)
      $ filter (\x-> fromMaybe true $ map (\title-> title.info.id /= x.info.id) semantic.titleProperty) 
      $ mkProperties item.content.data item.content.format.currentStructure.properties
    semantic = getContentSemanticData item.content.data item.content.format

    showProperty :: Property -> Maybe String
    showProperty prop = map (\x-> if S.length x > maxLength then (splitAt maxLength x).before <> "..." else x) str
      where
      str = case toTypedValue prop.value prop.info.type of
        IntTypedValue (Just vl) -> Just $ show vl
        BoolTypedValue (Just vl) -> Just $ show vl
        StringTypedValue (Just vl) -> Just vl
        TextTypedValue (JustReference vl) -> case fromJsonToMaterialObject vl of
          MaterialObjectRelated mat -> Just mat.displayName
          _ -> Nothing
        EnumTypedValue enums (Just vl) -> map _.displayName $ head $ filter (\en-> en.id == vl) enums
        ContentTypedValue _ (JustReference content) -> map _.text sm.titleProperty
          where
          sm = getContentSemanticData content.data content.format
        DocumentTypedValue (JustReference vl) -> case fromJsonToMaterialObject vl of
          MaterialObjectRelated mat -> Just mat.displayName
          _ -> Nothing
        _ -> Nothing

      maxLength = 15

    renderProperty :: { str :: String, prop :: Property } -> H.ComponentHTML Action ChildSlots m
    renderProperty { str, prop } = HH.span [ css "property" ] 
      [ propertyIcon prop.info
      , HH.text str
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    handleAction Load
  HandleInput input -> do
    state <- H.get
    when (input.value /= state.query) do
      H.modify_ _ { query = input.value, items = Loading }
      for_ state.timerSubId \subId->
        H.unsubscribe subId
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  Navigate event route -> navigateRoute event route
  FetchedContent fetch -> do
    forRemote fetch \items->
      H.modify_ _ { items = items }
  Load -> do
    state <- H.get
    for_ state.timerSubId \subId->
      H.unsubscribe subId
    case state.query of
      SearchAllQuery text -> do
        callbackQuery FetchedContent $ getSearchedAllContents text
      SearchByContainerQuery spaceId formatId text ->do
        callbackQuery FetchedContent $ getSearchedContentsInContainer spaceId formatId text