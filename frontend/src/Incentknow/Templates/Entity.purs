module Incentknow.Templates.Entity where

import Prelude

import Data.String (joinWith)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.HTML.Utils (css)

entity :: forall a s m. 
    { title :: String
    , entityType :: String
    , path :: Array String
    } -> H.ComponentHTML a s m -> H.ComponentHTML a s m
entity input body =
    HH.div
        [ css "tmp-entity" ]
        [ HH.div 
            [ css "title" ]
            [ HH.text input.title ]
        , HH.div 
            [ css "subtitle" ]
            [ HH.text $ input.entityType <> ":" <> joinWith ">" input.path ]
        , HH.div 
            [ css "body" ] 
            [ body ]
        ]