module Incentknow.Atoms.Message where

import Prelude

import Halogen.HTML as HH
import Incentknow.Atoms.Icon (icon)
import Incentknow.HTML.Utils (css)

error :: forall w i. String -> HH.HTML w i
error msg = HH.div [ css "atom-error" ] [ HH.span_ [ HH.text msg ] ]

success :: forall w i. String -> HH.HTML w i
success msg = HH.div [ css "atom-success" ] [ HH.span_ [ HH.text msg ] ]

data SaveState
  = HasNotChange
  | NotSaved
  | Saving
  | SavingButChanged
  | Saved

derive instance eqSaveState :: Eq SaveState

saveState :: forall w i. SaveState -> HH.HTML w i
saveState state =
  HH.div [ css "atom-save-state" ]
    [ case state of
        HasNotChange -> HH.text ""
        NotSaved -> icon "fas fa-edit"
        Saving -> icon "fas fa-edit"
        SavingButChanged -> icon "fas fa-edit"
        Saved -> icon "fas fa-save"
    ]
