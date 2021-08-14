module Incentknow.Pages.Space.Utils where

import Prelude

import Halogen.HTML as HH
import Incentknow.Atoms.Icon (icon)
import Incentknow.Data.Ids (SpaceDisplayId)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route(..), SpaceTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

renderMode :: forall p i. Boolean -> SpaceDisplayId -> (MouseEvent -> Route -> i) -> HH.HTML p i
renderMode isLeft spaceId navigate =
  HH.div [ css "mode" ]
    [ link navigate (Space spaceId SpaceHome)
        [ css $ "left item" <> if isLeft then " selected" else "" ] 
        [ icon "fas fa-info-circle" ]
    , link navigate (ContainerList spaceId)
      [ css $ "right item" <> if isLeft then "" else " selected" ] 
      [ icon "fas fa-bars" ]
    ]