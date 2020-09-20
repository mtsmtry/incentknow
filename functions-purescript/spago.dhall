{-
Welcome to a Spago project!
You can edit this file as you like.
-}
let main = ./../spago.dhall

in
{ name = "IncentknowFunctions"
, dependencies = main.dependencies
, packages = ./../packages.dhall
, sources = [ "src/**/*.purs", "../src/**/*.purs", "../lib/**/*.purs" ]
}