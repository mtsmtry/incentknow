module Incentknow.Atoms.Inputs where

import Prelude

import Data.Int (fromString)
import Data.Maybe (Maybe(..), maybe)
import Data.String (Pattern(..), Replacement(..), replace)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties (InputType(..))
import Halogen.HTML.Properties as HP
import Incentknow.Atoms.Icon (loadingWith)
import Incentknow.HTML.Utils (css)

submitButton ::
  forall a s m.
  { text :: String
  , loadingText :: String
  , isDisabled :: Boolean
  , isLoading :: Boolean
  , onClick :: a
  } ->
  H.ComponentHTML a s m
submitButton input =
  HH.button
    [ css "atom-submit-buttom"
    , HP.disabled input.isDisabled
    , HE.onClick $ \_ -> Just input.onClick
    ]
    [ HH.div
        [ css "inner" ]
        [ if input.isLoading then
            loadingWith input.text
          else
            HH.text input.text
        ]
    ]

createButton :: forall a s m. String -> a -> H.ComponentHTML a s m
createButton text onClick =
  submitButton
    { text: text
    , loadingText: ""
    , onClick: onClick
    , isDisabled: false
    , isLoading: false
    }

menuPositiveButton :: forall a s m. String -> a -> H.ComponentHTML a s m
menuPositiveButton text onClick =
  HH.button
    [ css "atom-positive-button"
    , HE.onClick $ \_ -> Just onClick
    ]
    [ HH.div
        [ css "inner" ]
        [ HH.text text ]
    ]

menuNegativeButton :: forall a s m. String -> a -> H.ComponentHTML a s m
menuNegativeButton text onClick =
  HH.button
    [ css "atom-negative-button"
    , HE.onClick $ \_ -> Just onClick
    ]
    [ HH.div
        [ css "inner" ]
        [ HH.text text ]
    ]

button :: forall a s m. String -> a -> H.ComponentHTML a s m
button text onClick =
  HH.button
    [ css "atom-button"
    , HE.onClick $ \_ -> Just onClick
    ]
    [ HH.text text ]

dangerButton :: forall a s m. String -> a -> H.ComponentHTML a s m
dangerButton text onClick =
  HH.button
    [ css "atom-danger-button"
    , HE.onClick $ \_ -> Just onClick
    ]
    [ HH.text text ]

textarea ::
  forall a s m.
  { value :: String
  , placeholder :: String
  , onChange :: String -> a
  } ->
  H.ComponentHTML a s m
textarea input =
  HH.textarea
    [ css "atom-textarea"
    , HP.spellcheck false
    --, HP.autocomplete false
    , HP.placeholder input.placeholder
    , HP.value $ removeReturn input.value
    , HE.onValueInput $ Just <<< input.onChange <<< removeReturn -- onValueChangeは正しくイベントが発火しないので使用しない
    ]
  where
  removeReturn = replace (Pattern "\n") (Replacement "") <<< replace (Pattern "\r") (Replacement "")

numberarea ::
  forall a s m.
  { value :: Maybe Int
  , onChange :: Maybe Int -> a
  } ->
  H.ComponentHTML a s m
numberarea input =
  HH.textarea
    [ css "atom-textarea"
    , HP.spellcheck false
    , HP.value $ show input.value
    , HE.onValueChange toEvent
    ]
  where
  toEvent :: String -> Maybe a
  toEvent str =
    if str == "" then case fromString str of
      Just number -> Just $ input.onChange $ Just number
      Nothing -> Nothing
    else
      Just $ input.onChange Nothing

pulldown :: forall a s m. Array String -> H.ComponentHTML a s m
pulldown items =
  HH.select
    [ css "atom-pulldown" ]
    (map item items)
  where
  item :: String -> H.ComponentHTML a s m
  item text =
    HH.option
      [ HP.value text ]
      [ HH.text text ]

checkbox :: forall p i. String -> Boolean -> (Boolean -> i) -> Boolean -> HH.HTML p i
checkbox text value onChange disabled =
  HH.div
    []
    [ HH.input
        [ HP.type_ InputCheckbox
        , HP.checked value
        , HE.onChecked $ Just <<< onChange
        , HP.disabled disabled
        ]
    , HH.text text
    ]

disabledCheckbox :: forall p i. String -> Boolean -> HH.HTML p i
disabledCheckbox text value  =
  HH.div
    []
    [ HH.input
        [ HP.type_ InputCheckbox
        , HP.checked value
        , HP.disabled true
        ]
    , HH.text text
    ]