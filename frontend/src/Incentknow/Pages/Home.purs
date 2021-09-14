module Incentknow.Pages.Home where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getPublishedSpaces)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (FocusedSpace, RelatedSpace)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.SpaceCardView as SpaceCardView
import Incentknow.Pages.Content as Content
import Incentknow.Pages.Space as Space
import Incentknow.Route (ContentSpec(..))
import Incentknow.Templates.Main (centerLayout)

type Input
  = {}

type State
  = { publishedSpaces :: Remote (Array RelatedSpace) }

data Action
  = Initialize
  | HandleInput Input
  | FetchedPublishedSpaces (Fetch (Array RelatedSpace))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( space :: Space.Slot Unit
    , content :: Content.Slot Unit
    , cardview :: SpaceCardView.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { publishedSpaces: Loading }

-- 知的生産性を向上させるためのSNS
-- この世で最も柔軟なSNSです
-- さあ、今すぐクリーンでクリアでストレスレスなIncentknowの世界に飛び込みましょう！

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-home" ]
    [ HH.div [ css "logo" ]
        [ HH.text "Incentknow" ]
    , HH.div [ css "desc" ]
        [ HH.text "情報を整理し共有するためのプラットフォーム" ]
    , HH.div [ css "part" ]
        [ HH.div [ css "header" ]
            [ HH.text "ちらばった情報を一箇所に整理" ]
        , HH.div [ css "desc" ]
            [ HH.text "もうどこに必要な情報があるのか探す必要はなくなります。一箇所にまとまっているのでどれが本当の情報かを確かめる必要もありません。" ]
        , HH.div [ css "example" ]
            [ HH.slot (SProxy :: SProxy "space") unit Space.component { spaceId: wrap "930774711778059", tab: Right (Just $ wrap "135605421976660") } absurd
            ]
        ]
    , HH.div [ css "part" ]
        [ HH.div [ css "header" ]
            [ HH.text "自在に情報を関連づける" ]
        , HH.div [ css "desc" ]
            [ HH.text "どのような構造の情報でも整理することができます。情報同士を紐付け、すぐに必要な情報にアクセスできるようにすることができます。" ]
        , HH.div [ css "example" ]
            [ HH.slot (SProxy :: SProxy "content") unit Content.component { contentSpec: ContentSpecContentId $ wrap "vME9fV25gHek" } absurd 
            ]
        ]
    , HH.div [ css "part" ]
        [ HH.div [ css "header" ]
            [ HH.text "チームで整理し、公開できる" ]
        , HH.div [ css "desc" ]
            [ HH.text "たくさんの整理された情報が公開されています。" ]
        , HH.div [ css "example" ]
            [ remoteWith state.publishedSpaces \spaces ->
                HH.slot (SProxy :: SProxy "cardview") unit SpaceCardView.component { value: spaces } absurd
          ]
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
   callbackQuery FetchedPublishedSpaces $ getPublishedSpaces unit
  HandleInput input -> handleAction Initialize
  FetchedPublishedSpaces fetch ->
    forRemote fetch \spaces ->
      H.modify_ _ { publishedSpaces = spaces }