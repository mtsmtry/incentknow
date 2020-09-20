module Incentknow.Templates.Main where

import Prelude
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (Message(..))
import Incentknow.Atoms.Message (error, success)
import Incentknow.HTML.Utils (css)

centerize :: forall a s m. Array (H.ComponentHTML a s m) -> H.ComponentHTML a s m
centerize elements =
  HH.div
    [ css "tmp-main_centerize"
    ]
    [ HH.div [ css "side" ] []
    , HH.div [ css "main" ] elements
    , HH.div [ css "side" ] []
    ]

main ::
  forall a s m.
  { header :: H.ComponentHTML a s m
  , footer :: H.ComponentHTML a s m
  , body :: H.ComponentHTML a s m
  , messages :: Array Message
  , leftSide :: H.ComponentHTML a s m
  , rightSide :: H.ComponentHTML a s m
  } ->
  H.ComponentHTML a s m
main input =
  HH.div
    [ css "tmp-main" ]
    [ HH.div [ css "header" ] [ centerize [ input.header ] ]
    , HH.div
        [ css "body" ]
        [ HH.div_
            [ HH.div [ css "side" ] [ HH.div_ [ input.leftSide ] ]
            , HH.div [ css "main" ]
                [ HH.div [] (map message input.messages)
                , HH.div [ css "tmp-main_section" ] [ input.body ]
                ]
            , HH.div [ css "side" ] [ HH.div_ [ input.rightSide ] ]
            ]
        ]
    , HH.div [ css "footer" ] [ centerize [ input.footer ] ]
    ]
  where
  message :: Message -> H.ComponentHTML a s m
  message msg =
    HH.div [ css "tmp-main_message" ]
      [ case msg of
          Error text -> error text
          Success text -> success text
      ]
