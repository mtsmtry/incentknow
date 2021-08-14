module Incentknow.Molecules.Setting.Image where

import Prelude

import DOM.HTML.Indexed.InputAcceptType (mediaType)
import Data.Either (Either(..))
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), isNothing)
import Data.Maybe.Utils (flatten)
import Data.MediaType (MediaType(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.Setting (ChangingState(..), SettingOutput(..), SettingQuery, handleSettingQuery, renderEditButton, renderMessage, renderSubmitButton)
import Web.Event.Internal.Types (Event)
import Web.File.Blob (Blob)
import Web.File.File (File, toBlob)
import Web.File.FileList (item)
import Web.File.Url (createObjectURL)
import Web.HTML.HTMLInputElement (files, fromElement)

type Input
  = { submit :: Blob -> Aff (Either String {})
    , value :: Maybe String
    , disabled :: Boolean
    }

type State
  = { state :: ChangingState
    , typingIcon :: Maybe { file :: File, blob :: Blob, url :: String }
    , nowUrl :: Maybe String
    , submit :: Blob -> Aff (Either String {})
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change Event
  | Edit
  | Submit
  | Cancel

type Slot
  = H.Slot SettingQuery SettingOutput

type ChildSlots
  = ()

component :: forall m. MonadAff m => MonadEffect m => H.Component HH.HTML SettingQuery Input SettingOutput m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            , handleQuery = handleSettingQuery
            }
    }

initialState :: Input -> State
initialState input =
  { state: None
  , typingIcon: Nothing
  , nowUrl: input.value
  , submit: input.submit
  , disabled: input.disabled
  }

setInput :: Input -> State -> State
setInput input state =
  { state: state.state
  , typingIcon: state.typingIcon
  , nowUrl: input.value
  , submit: input.submit
  , disabled: input.disabled
  }

iconInput_ :: H.RefLabel
iconInput_ = H.RefLabel "iconInput"

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "item" ]
    [ HH.div [ css "main" ]
        [ HH.div [ css "left" ]
            [ HH.label_ [ HH.text "アイコン" ]
            , HH.div [ css "value" ]
                [ let
                    iconUrl = case state.typingIcon of
                      Just file -> Just file.url
                      Nothing -> state.nowUrl
                  in
                    case state.state of
                      None ->
                        HH.div [ css "icon" ]
                          [ renderImage state.nowUrl
                          ]
                      Changing ->
                        HH.div [ css "icon" ]
                          [ renderImage iconUrl
                          , renderIconInput false
                          ]
                      Sending ->
                        HH.div [ css "icon" ]
                          [ renderImage iconUrl
                          , renderIconInput true
                          ]
                      Failed _ ->
                        HH.div [ css "icon" ]
                          [ renderImage iconUrl
                          , renderIconInput false
                          ]
                      Changed ->
                        HH.div [ css "icon" ]
                          [ renderImage state.nowUrl
                          ]
                ]
            ]
        , whenElem (not state.disabled) \_ ->
            HH.div [ css "right" ] [ renderEditButton state.state Edit ]
        ]
    , renderSubmitButton state.state Submit Cancel (isNothing state.typingIcon)
    , renderMessage "アイコンを変更しました" state.state
    ]
  where
  renderIconInput :: Boolean -> H.ComponentHTML Action ChildSlots m
  renderIconInput disabled =
    HH.input
      [ HP.type_ HP.InputFile
      , HP.ref iconInput_
      , HP.disabled disabled
      , HP.accept $ mediaType $ MediaType "image/jpeg,image/png,image/webp"
      , HE.onChange $ Just <<< Change
      ]

  renderImage :: Maybe String -> H.ComponentHTML Action ChildSlots m
  renderImage url = maybeElem url \x -> HH.img [ HP.src x ]

handleAction :: forall m. MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots SettingOutput m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ $ setInput input
  Submit -> do
    state <- H.get
    for_ state.typingIcon \icon -> do
      H.modify_ _ { state = Sending }
      result <- H.liftAff $ state.submit icon.blob
      case result of
        Right _ -> H.modify_ _ { state = Changed }
        Left msg -> H.modify_ _ { state = Failed msg } --"画像のアップロードに失敗しました" }
  Change event -> do
    flatten <$> map fromElement <$> H.getRef iconInput_
      >>= traverse_ \input -> do
          fileList <- H.liftEffect $ files input
          let
            maybeFile = flatten $ map (item 0) fileList
          for_ maybeFile \file -> do
            let
              blob = toBlob file
            url <- H.liftEffect $ createObjectURL blob
            H.modify_ _ { typingIcon = Just { file, blob, url } }
  Cancel -> H.modify_ _ { state = None }
  Edit -> do
    H.modify_ _ { state = Changing }
    H.raise Edited
