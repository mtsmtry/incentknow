module Incentknow.Templates.Page where

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.HTML.Utils (css)

tabPage ::
  forall a s m t.
  Eq t =>
  { tabs :: Array t
  , onChangeTab :: (t -> a)
  , currentTab :: t
  , showTab :: t -> String
  } ->
  Array (H.ComponentHTML a s m) ->
  Array (H.ComponentHTML a s m) ->
  Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
tabPage input menu header body =
  HH.div [ css "tmp-tab-page" ]
    [ HH.div [ css "header" ]
        [ HH.div [ css "top" ] header
        , HH.div [ css "menu" ]
            ( (map renderTab input.tabs)
                <> [ HH.div [ css "space" ] [] ]
                <> [ HH.div [ css "ext-menu" ] menu ]
            )
        ]
    , HH.div [ css "body" ] body
    ]
  where
  renderTab :: t -> H.ComponentHTML a s m
  renderTab tab =
    HH.div
      [ css $ "tab-item" <> if input.currentTab == tab then " selected" else ""
      , HE.onClick $ \_ -> Just $ input.onChangeTab tab
      ]
      [ HH.text $ input.showTab tab ]

section :: forall a s m. String -> Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
section class_ body = HH.div [ css $ "tmp-section" <> " " <> class_ ] body

tabGrouping ::
  forall a s m t.
  Eq t =>
  { tabs :: Array t
  , onChangeTab :: (t -> a)
  , currentTab :: t
  , showTab :: t -> String
  } ->
  Array (H.ComponentHTML a s m) ->
  Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
tabGrouping input menu body =
  HH.div
    [ css "tmp-tab-grouping" ]
    [ HH.div [ css "tabs" ] (map (renderTab) input.tabs)
    , HH.div [ css "bar" ] menu
    , HH.div [ css "body" ] body
    ]
  where
  renderTab :: t -> H.ComponentHTML a s m
  renderTab tab =
    HH.div
      [ css (if input.currentTab == tab then "tab tab_active" else "tab")
      , HE.onClick \_ -> Just $ input.onChangeTab tab
      ]
      [ HH.text $ input.showTab tab
      ]

creationPage ::
  forall a s m.
  { title :: String
  , desc :: String
  } ->
  Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
creationPage input body =
  HH.div
    [ css "tmp-creation-page" ]
    [ HH.div [ css "title" ] [ HH.text input.title ]
    , HH.div [ css "desc" ] [ HH.text input.desc ]
    , HH.div [ css "body" ] body
    ]
