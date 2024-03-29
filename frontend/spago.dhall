{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "Incentknow"
, dependencies =
  [ "aff"
  , "aff-coroutines"
  , "aff-promise"
  , "affjax"
  , "argonaut-codecs"
  , "argonaut-core"
  , "avar"
  , "console"
  , "const"
  , "control"
  , "coroutines"
  , "css"
  , "datetime"
  , "dom-indexed"
  , "effect"
  , "enums"
  , "foldable-traversable"
  , "foreign"
  , "foreign-generic"
  , "fork"
  , "free"
  , "freeap"
  , "halogen"
  , "halogen-css"
  , "halogen-vdom"
  , "media-types"
  , "node-fs"
  , "node-fs-aff"
  , "node-http"
  , "nullable"
  , "numbers"
  , "ordered-collections"
  , "parallel"
  , "profunctor"
  , "psci-support"
  , "random"
  , "record"
  , "routing"
  , "simple-json"
  , "spec"
  , "string-parsers"
  , "stringutils"
  , "test-unit"
  , "transformers"
  , "typelevel-prelude"
  , "unsafe-coerce"
  , "unsafe-reference"
  , "web-file"
  , "web-socket"
  , "web-uievents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "lib/**/*.purs" ]
}