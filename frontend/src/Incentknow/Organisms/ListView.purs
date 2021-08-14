module Incentknow.Organisms.ListView where

import Prelude

import Data.Array (catMaybes, filter, head)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String as S
import Data.String.CodeUnits (splitAt)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (propertyIcon, userIcon)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Property (MaterialObject(..), Property, ReferenceValue(..), TypedValue(..), fromJsonToMaterialObject, mkProperties, toTypedValue)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route(..), UserTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Array RelatedContent
    }

type State
  = { items :: Array RelatedContent
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

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
initialState input = { items: input.value }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-listview" ]
    (map renderItem state.items)
  where
  renderItem :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderItem item =
    HH.div [ css "item" ]
      [ HH.div [ css "user" ]
          [ link Navigate (User item.creatorUser.displayId UserMain) 
              []
              [ userIcon item.creatorUser ]
          ]
      , HH.div [ css "main" ]
          [ link Navigate (Content item.contentId)
              []
              [ HH.span [ css "title" ] [ HH.text semantic.title ]
              , HH.span [ css "properties" ] (map renderProperty properties)
              ]
          ]
      , HH.div [ css "timestamp" ]
          [ link Navigate (Content item.contentId) 
              []
              [ dateTime item.createdAt ]
          ]
      ]
    where
    properties =
      catMaybes
      $ map (\prop-> map (\str-> { str, prop }) $ showProperty prop)
      $ filter (\x-> fromMaybe true $ map (\title-> title.info.id /= x.info.id) semantic.titleProperty) 
      $ mkProperties item.data item.format.currentStructure.properties
    semantic = getContentSemanticData item.data item.format

    showProperty :: Property -> Maybe String
    showProperty prop = map (\x-> if S.length x > maxLength then (splitAt maxLength x).before <> "..." else x) str
      where
      str = case toTypedValue prop.value prop.info.type of
        IntTypedValue (Just vl) -> Just $ show vl
        BoolTypedValue (Just vl) -> Just $ show vl
        StringTypedValue (Just vl) -> Just vl
        TextTypedValue (Just vl) -> Just vl
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

handleAction :: forall o m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
