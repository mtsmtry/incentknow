module Ace.Completer where

import Prelude

import Ace.Types (Completer, Editor)
import Data.Function.Uncurried (Fn2, runFn2)
import Effect (Effect)

foreign import setCompletersImpl
  :: Fn2 (Array Completer) Editor (Effect Unit)

setCompleters
  :: (Array Completer) -> Editor -> Effect Unit
setCompleters comps self = runFn2 setCompletersImpl comps self
