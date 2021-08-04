module Incentknow.Organisms.Footer where

import Prelude

import Data.Newtype (wrap)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.HTML.Utils (css, link_)
import Incentknow.Route (Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type State
  = {}

data Action
  = Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

component :: forall q i o m. Behaviour m => H.Component HH.HTML q i o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

handleAction :: forall o m. Behaviour m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Navigate event route -> navigateRoute event route

initialState :: forall i. i -> State
initialState input = {}

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.footer
    [ css "org-footer" ]
    -- Copyright
    [ HH.div
        [ css "copyright" ]
        [ HH.text "@Incentknow" ]
    -- Links
    , HH.nav
        [ css "links" ]
        [ HH.div [ css "inner" ] 
            [ footerLink "Developer" (Content $ wrap "451b942c983e418287b284f6ac8cf523")
            , footerLink "Support" (Content $ wrap "")
            , footerLink "Contact" (Content $ wrap "")
            ]
        ]
    ]
  where
  footerLink :: String -> Route -> H.ComponentHTML Action () m
  footerLink name route =
    HH.span
      [ css "link" ]
      [ link_ Navigate route [ HH.text name ] ]
