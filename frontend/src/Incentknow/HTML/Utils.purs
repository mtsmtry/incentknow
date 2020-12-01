module Incentknow.HTML.Utils where

import Prelude

import DOM.HTML.Indexed as I
import Data.Maybe (Maybe(..))
import Halogen.HTML (IProp)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Route (Route, routeToPath)
import Web.UIEvent.MouseEvent (MouseEvent)

-- href :: forall r i. i -> HP.IProp ( onClick :: MouseEvent | r ) i
-- href action = HE.onClick $ \_ -> Just action

-- | I get annoyed writing `class_ $ ClassName "..."` over and over again. This small utility saves
-- | a few characters all over our HTML.
css :: forall r i. String -> HH.IProp ( class :: String | r ) i
css = HP.class_ <<< HH.ClassName

-- | Sometimes we need to deal with elements which may or may not exist. This function lets us
-- | provide rendering for the element if it exists, and renders an empty node otherwise.
maybeElem :: forall p i a. Maybe a -> (a -> HH.HTML p i) -> HH.HTML p i
maybeElem (Just x) f = f x

maybeElem _ _ = HH.text ""

-- | PureScript is a strict language. If we want to conditionally display an element, then we
-- | should hide the evaluation behind a function, which won't be evaluated right away, in order
-- | to minimize the work performed each render.
whenElem :: forall p i. Boolean -> (Unit -> HH.HTML p i) -> HH.HTML p i
whenElem cond f = if cond then f unit else HH.text ""

link :: forall p i. (MouseEvent -> Route -> i) -> Route -> Array (IProp (I.HTMLa) i) -> Array (HH.HTML p i) -> HH.HTML p i
link navigate route props =
  HH.a $
    [ HE.onClick $ \e -> Just $ navigate e route
    , HP.href $ routeToPath route
    ] <> props

link_ :: forall p i. (MouseEvent -> Route -> i) -> Route -> Array (HH.HTML p i) -> HH.HTML p i
link_ navigate route =
  HH.a
    [ HE.onClick $ \e -> Just $ navigate e route
    , HP.href $ routeToPath route
    ]