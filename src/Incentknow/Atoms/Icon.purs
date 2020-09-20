module Incentknow.Atoms.Icon where

import Prelude

import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api.Utils (Remote(..))
import Incentknow.HTML.Utils (css)

loadingWith :: forall w i. String -> HH.HTML w i
loadingWith msg =
  HH.div
    [ css "atom-loading-icon"
    ]
    [ HH.div
        [ css "text" ]
        [ HH.text msg ]
    , HH.div
        [ css "icon loaderCircle" ]
        []
    ]

remoteWith :: forall a w i. Remote a -> (a -> HH.HTML w i) -> HH.HTML w i
remoteWith remote body = case remote of
  Loading -> HH.text ""
  LoadingForServer -> HH.div [ css "atom-remote-loading" ] [ HH.div [ css "loaderNormal" ] [] ]
  Holding item -> body item
  Missing error -> HH.text error