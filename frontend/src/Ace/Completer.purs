module Ace.Completer where

import Prelude

import Ace.Types (Completer, Position, EditSession, Editor, Completion)
import Data.Function.Uncurried (Fn2, Fn3, runFn2, runFn3)
import Data.Maybe (Maybe, isJust, fromJust)
import Effect (Effect)
import Partial.Unsafe (unsafePartial)

foreign import setCompletersImpl
  :: Fn2 (Array Completer) Editor (Effect Unit)

setCompleters
  :: (Array Completer) -> Editor -> Effect Unit
setCompleters comps self = runFn2 setCompletersImpl comps self
