module Incentknow.Molecules.Form where

import Halogen as H
import Halogen.HTML as HH
import Incentknow.Atoms.Inputs (textarea)

define :: forall a s m. String -> Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
define label inner =
  HH.dl
    []
    [ HH.dt []
        [ HH.label_ [ HH.text label ] ]
    , HH.dd []
        inner
    ]

defineText ::
  forall a s m.
  { label :: String
  , value :: String
  , onChange :: String -> a
  } ->
  H.ComponentHTML a s m
defineText input =
  define input.label
    [ textarea { placeholder: "", value: input.value, onChange: input.onChange }
    ]
