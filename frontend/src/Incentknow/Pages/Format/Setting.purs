module Incentknow.Pages.Format.Setting where

import Prelude

import Affjax as AX
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ResponseFormat
import DOM.HTML.Indexed.InputAcceptType (mediaType)
import Data.Either (Either(..))
import Data.Foldable (for_, traverse_)
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.MediaType (MediaType(..))
import Data.Nullable (toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (checkSpaceDisplayId, setMyDisplayName, setMyEmail, setMyIcon, setMyPassword, setSpaceAuthority, setSpaceDisplayId, setSpaceDisplayName, setSpaceHomeImage, setSpaceMembershipMethod, setSpacePublished)
import Incentknow.Api.Utils (callApi, executeApi, subscribeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button, submitButton, textarea)
import Incentknow.Data.Ids (SpaceId(..), UserId(..))
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery(..))
import Incentknow.Molecules.Setting.AuthMenu as SettingAuthMenu
import Incentknow.Molecules.Setting.Checkbox as SettingCheckbox
import Incentknow.Molecules.Setting.DisplayId as SettingDisplayId
import Incentknow.Molecules.Setting.GeneratorMenu as GeneratorMenu
import Incentknow.Molecules.Setting.Image as SettingImage
import Incentknow.Molecules.Setting.Text as SettingText
import Incentknow.Organisms.ContentList as ContentList
import Pipes (discard)

type Input
  = { format :: Format
    , disabled :: Boolean
    }

type State
  = { format :: Format
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Edit SettingOutput

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( generatorMenu :: GeneratorMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            }
    }

initialState :: Input -> State
initialState input =
  { format: input.format
  , disabled: input.disabled
  }

generatorMenu_ = SProxy :: SProxy "generatorMenu"

render :: forall m. MonadAff m => Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-user-setting" ]
    [ whenElem (state.format.usage == "internal") \_ ->
        HH.slot generatorMenu_ unit GeneratorMenu.component
          { submit: callApi <<< \x -> setContentGenerator state.format.formatId (fromMaybe "" x)
          , value: Just state.format.generator
          , title: "ジェネレータの設定"
          , desc: "コンテンツを自動的に生成する設定をします"
          , disabled: state.disabled
          }
          (Just <<< Edit)
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Edit _ -> do
    -- discard $ H.query displayName_ unit $ H.tell Reset
    pure unit
