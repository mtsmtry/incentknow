module Incentknow.Atoms.Message where

import Prelude
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Atoms.Icon (loadingWith)
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
        HasNotChange -> HH.text "変更なし"
        NotSaved -> loadingWith "保存中"
        Saving -> loadingWith "保存中"
        SavingButChanged -> loadingWith "保存中"
        Saved -> HH.text "保存済み"
    ]
