module Incentknow.Molecules.TabMenu where

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.HTML.Utils (css)

tabMenu ::
  forall a s m t.
  Show t =>
  { tabs :: Array t
  , onChangeTab :: (t -> a)
  , currentTab :: t
  } ->
  H.ComponentHTML a s m
tabMenu input =
  HH.div [ css "mol-tab-menu" ]
    ( (map renderTab input.tabs)
        <> [ HH.div [ css "space" ] [] ]
    )
  where
  renderTab :: t -> H.ComponentHTML a s m
  renderTab tab =
    HH.div
      [ css $ "tab-item" <> if show input.currentTab == show tab then " selected" else ""
      , HE.onClick $ \_ -> Just $ input.onChangeTab tab
      ]
      [ HH.text $ show tab ]
