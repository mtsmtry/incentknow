module Incentknow.Route where

import Prelude

import Data.Array (fromFoldable, toUnfoldable)
import Data.Either (Either(..))
import Data.Foldable (oneOf)
import Data.List (List(..))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (unwrap, wrap)
import Data.String (joinWith)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Class (class MonadEffect)
import Effect.Class as H
import Incentknow.Data.Ids (ContentDraftId(..), ContentId(..), FormatDisplayId(..), FormatId(..), MaterialDraftId(..), MaterialId(..), SemanticId(..), SpaceDisplayId(..), SpaceId(..), StructureId(..), UserDisplayId)
import Routing (match)
import Routing.Match (Match(..), end, int, lit, root, str)
import Routing.Types (RoutePart(..))

data ContentSpec
  = ContentSpecContentId ContentId
  | ContentSpecSemanticId FormatId SemanticId

derive instance eqContentSpec :: Eq ContentSpec

data FormatTab
  = FormatMain
  | FormatPage
  | FormatVersions
  | FormatSetting
  | FormatReactor

data SpaceTab
  = SpaceHome
  | SpaceContainers
  | SpaceFormat FormatDisplayId FormatTab
  | SpaceMembers
  | SpaceCrawlers
  | SpaceSetting

--data CrawlerTab
  -- = CrawlerMain
  -- | CrawlerOperations
  -- | CrawlerOperation CrawlerOperationId
  -- | CrawlerCaches

data UserTab
  = UserMain
  | UserSetting

data EditContentTarget
  = TargetBlank (Maybe SpaceId) (Maybe StructureId)
  | TargetDraft ContentDraftId
  | TargetContent ContentId

derive instance eqEditContentTarget :: Eq EditContentTarget

data EditMaterialTarget
  = MaterialTargetBlank (Maybe SpaceId)
  | MaterialTargetDraft MaterialDraftId
  | MaterialTargetMaterial MaterialId

derive instance eqEditMaterialTarget :: Eq EditMaterialTarget

data EditTarget
  = ContentTarget EditContentTarget
  | MaterialTarget EditMaterialTarget

derive instance eqEditTarget :: Eq EditTarget

data Route
  = Home
  | Sign
  | User UserDisplayId UserTab
  | DraftList
  | Content ContentId
  | ActivateAccount String
  | ContentBySemanticId FormatId SemanticId
  | EditDraft EditTarget
  | SpaceList
  | Container SpaceDisplayId FormatDisplayId
  | ContainerList SpaceDisplayId
  | SearchAll (Maybe String)
  -- | Composition SpaceId FormatId String
  -- | ContentList (Maybe SpaceId) (Maybe FormatId) (Array (Tuple String (Maybe String)))
  | Public
  | JoinSpace SpaceId
  | NewFormat SpaceId
  -- | EditDraft ContentDraftId
  | EditScraper ContentId
  | Space SpaceDisplayId SpaceTab
  | Rivision ContentId Int
  | RivisionList ContentId
  -- | Snapshot ContentDraftId SnapshotDiff
  | NewSpace
 -- | NewCrawler
 -- | Crawler CrawlerId CrawlerTab
  | NotFound
  | Notifications

derive instance eqFormatTab :: Eq FormatTab

derive instance eqSpaceTab :: Eq SpaceTab

--derive instance eqCrawlerTab :: Eq CrawlerTab

derive instance eqUserTab :: Eq UserTab

derive instance eqRoute :: Eq Route

paramsToUrl :: Array (Tuple String (Maybe String)) -> String
paramsToUrl = arrayToList >>> paramsToUrl' >>> addHead
  where
  addHead str = if str == "" then "" else "?" <> str

  arrayToList :: forall a. Array a -> List a
  arrayToList = toUnfoldable

  listToArray :: forall a. List a -> Array a
  listToArray = fromFoldable

  cutNothing :: forall a. List (Maybe a) -> List a
  cutNothing = case _ of
    Cons (Just x) xs -> Cons x $ cutNothing xs
    Cons Nothing xs -> cutNothing xs
    Nil -> Nil

  toString :: Tuple String (Maybe String) -> Maybe String
  toString = case _ of
    (Tuple _ Nothing) -> Nothing
    (Tuple key (Just value)) -> Just $ key <> "=" <> value

  paramsToUrl' :: List (Tuple String (Maybe String)) -> String
  paramsToUrl' = map toString >>> cutNothing >>> listToArray >>> joinWith "&"

routeToPath :: Route -> String
routeToPath = case _ of
  Home -> "/"
  SearchAll query -> "/search" <> paramsToUrl [ Tuple "q" query ]
  Sign -> "/sign"
  Public -> "/public"
  Notifications -> "/notifications"
  ActivateAccount token -> "/activate" <> paramsToUrl [ Tuple "token" $ Just token ]
  User id UserMain -> "/users/" <> unwrap id
  User id UserSetting -> "/users/" <> unwrap id <> "/setting"
  Content id -> "/contents/" <> unwrap id
  EditDraft (ContentTarget (TargetBlank spaceId structureId)) -> "/contents/new" <> paramsToUrl [ Tuple "space" $ map unwrap spaceId, Tuple "structure" $ map unwrap structureId ]
  EditDraft (ContentTarget (TargetDraft id)) -> "/contents/" <> unwrap id <> "/edit"
  EditDraft (ContentTarget (TargetContent contentId)) -> "/contents/new" <> paramsToUrl [ Tuple "content" $ Just $ unwrap contentId ]
  EditDraft (MaterialTarget (MaterialTargetBlank spaceId)) -> "/materials/new" <> paramsToUrl [ Tuple "space" $ map unwrap spaceId ]
  EditDraft (MaterialTarget (MaterialTargetDraft id)) -> "/materials/" <> unwrap id <> "/edit"
  EditDraft (MaterialTarget (MaterialTargetMaterial materialId)) -> "/materials/new" <> paramsToUrl [ Tuple "material" $ Just $ unwrap materialId ]
  Rivision id ver -> "/contents/" <> unwrap id <> "/rivisions/" <> show ver
  RivisionList id -> "/contents/" <> unwrap id <> "/rivisions"
  ContentBySemanticId formatId semanticId -> "/contents/" <> unwrap formatId <> "/" <> unwrap semanticId
  -- draft
  DraftList -> "/drafts"
  --EditDraft id -> "/drafts/" <> unwrap id <> "/edit"
  --Snapshot draftId diff -> "/drafts/" <> unwrap draftId <> "/" <> show diff
  NewFormat id -> "/spaces/" <> unwrap id <> "/formats/new"
  --ContentList spaceId formatId params -> "/contents" <> paramsToUrl ([ Tuple "space" $ map unwrap spaceId, Tuple "format" $ map unwrap formatId ] <> params)
  Container spaceId formatId -> "/spaces/" <> unwrap spaceId <> "/" <> unwrap formatId
  -- communities
  SpaceList -> "/spaces"
  JoinSpace id -> "/spaces/" <> unwrap id <> "/join"
  -- space
  NewSpace -> "/spaces/new"
  EditScraper id -> "/contents/" <> unwrap id <> "/edit/scraper"
  ContainerList id -> "/spaces/" <> unwrap id <> "/containers"
  Space id SpaceHome -> "/spaces/" <> unwrap id
  Space id SpaceContainers -> "/spaces/" <> unwrap id <> "/formats"
  Space id SpaceMembers -> "/spaces/" <> unwrap id <> "/members"
  Space id SpaceCrawlers -> "/spaces/" <> unwrap id <> "/crawlers"
  Space id SpaceSetting -> "/spaces/" <> unwrap id <> "/setting"
  -- format
  Space id (SpaceFormat formatId FormatMain) -> "/spaces/" <> unwrap id <> "/formats/" <> unwrap formatId
  Space id (SpaceFormat formatId FormatPage) -> "/spaces/" <> unwrap id <> "/formats/" <> unwrap formatId <> "/page"
  Space id (SpaceFormat formatId FormatVersions) -> "/spaces/" <> unwrap id <> "/formats/" <> unwrap formatId <> "/versions"
  Space id (SpaceFormat formatId FormatSetting) -> "/spaces/" <> unwrap id <> "/formats/" <> unwrap formatId <> "/setting"
  Space id (SpaceFormat formatId FormatReactor) -> "/spaces/" <> unwrap id <> "/formats/" <> unwrap formatId <> "/reactor"
  -- crawler
  --NewCrawler -> "/crawlers/new"
  --Crawler id CrawlerMain -> "/crawlers/" <> unwrap id
  --Crawler id CrawlerOperations -> "/crawlers/" <> unwrap id <> "/operations"
 -- Crawler id (CrawlerOperation ope) -> "/crawlers/" <> unwrap id <> "/operations/" <> show (unwrap ope)
  --Crawler id CrawlerCaches -> "/crawlers/" <> unwrap id <> "/caches"
  -- others
  NotFound -> "/not-found"

matchParam :: String -> Match (Maybe String)
matchParam key =
  Match \route -> case route of
    Cons (Query map) rs -> do
      let
        remainingParams = M.delete key map
      let
        el = M.lookup key map
      pure
        $ if M.isEmpty remainingParams then
            Tuple rs el
          else
            Tuple (Cons (Query remainingParams) rs) el
    rs -> do
      pure $ Tuple rs Nothing

matchParams :: Match (Array (Tuple String (Maybe String)))
matchParams =
  Match \route -> case route of
    Cons (Query m) rs -> pure $ Tuple rs $ (M.toUnfoldable $ map Just m :: Array (Tuple String (Maybe String)))
    rs -> pure $ Tuple rs []

matchRoute :: Match Route
matchRoute =
  root
    *> oneOf
        [ Home <$ end
        , Sign <$ (lit "sign" <* end)
        , Public <$ (lit "public" <* end)
        , Notifications <$ (lit "notifications" <* end)
        , SearchAll <$> (lit "search" *> matchParam "q" <* end)
        , (ActivateAccount <<< fromMaybe "") <$> (lit "activate" *> matchParam "token" <* end)
        -- user
        , (flip User UserMain) <$> (map wrap $ lit "users" *> str <* end)
        , (flip User UserSetting) <$> (map wrap $ lit "users" *> str <* lit "setting" <* end)
        -- community
        , SpaceList <$ (lit "spaces" <* end)
        , JoinSpace <$> (map SpaceId $ lit "spaces" *> str <* lit "join" <* end)
        -- draft
        , DraftList <$ (lit "drafts" <* end)
        --, Snapshot <$> (lit "drafts" *> (map wrap str)) <*> ((map toSnapshotDiff str) <* end)
        --, EditDraft <$> (map wrap $ lit "drafts" *> str <* lit "edit" <* end)
        -- content
        , EditScraper <$> (map ContentId $ lit "contents" *> str <* lit "edit" <* lit "scraper" <* end)

        , (EditDraft <<< ContentTarget <<< TargetDraft) <$> (map ContentDraftId $ lit "contents" *> str <* lit "edit" <* end)
        , (\x-> \y-> EditDraft <<< ContentTarget $ TargetBlank x y) <$> (lit "contents" <* lit "new" *> space) <*> structure <* end
        , (EditDraft <<< ContentTarget <<< TargetContent) <$> (map ContentId $ lit "contents" *> str <* lit "edit" <* end)

        , (EditDraft <<< MaterialTarget <<< MaterialTargetDraft) <$> (map MaterialDraftId $ lit "materials" *> str <* lit "edit" <* end)
        , (\x-> EditDraft <<< MaterialTarget $ MaterialTargetBlank x) <$> (lit "materials" <* lit "new" *> space) -- <*> structure <* end
        , (EditDraft <<< MaterialTarget <<< MaterialTargetMaterial) <$> (map MaterialId $ lit "materials" *> str <* lit "edit" <* end)
        
        , Content <$> (map ContentId $ lit "contents" *> str <* end)
        , RivisionList <$> (map ContentId $ lit "contents" *> str <* lit "rivisions" <* end)
        , Rivision <$> (map ContentId $ lit "contents" *> str) <*> (lit "rivisions" *> int <* end)
        , ContentBySemanticId <$> (lit "contents" *> (map FormatId str)) <*> (map SemanticId str) <* end
        --, ContentList <$ lit "contents" <*> space <*> format <*> matchParams <* end
        -- format
        , ContainerList <$> (map wrap $ lit "spaces" *> str) <* (lit "containers" <* end)
        , (\x-> \y-> Space x $ SpaceFormat y FormatMain) <$> (map wrap $ lit "spaces" *> str) <*> (map wrap $ lit "formats" *> str <* end)
        , (\x-> \y-> Space x $ SpaceFormat y FormatPage) <$> (map wrap $ lit "spaces" *> str) <*> (map wrap $ lit "page" *> str <* end)
        , (\x-> \y-> Space x $ SpaceFormat y FormatVersions) <$> (map wrap $ lit "spaces" *> str) <*> (map wrap $ lit "versions" *> str <* end)
        , (\x-> \y-> Space x $ SpaceFormat y FormatSetting) <$> (map wrap $ lit "spaces" *> str) <*> (map wrap $ lit "setting" *> str <* end)
        , (\x-> \y-> Space x $ SpaceFormat y FormatReactor) <$> (map wrap $ lit "spaces" *> str) <*> (map wrap $ lit "reactor" *> str <* end)
        -- spaces
        , NewSpace <$ (lit "spaces" <* lit "new")
        , NewFormat <$> (map SpaceId $ lit "spaces" *> str <* lit "formats" <* lit "new" <* end)
        , (flip Space SpaceHome) <$> (map wrap $ lit "spaces" *> str <* end)
        , (flip Space SpaceContainers) <$> (map wrap $ lit "spaces" *> str <* lit "formats" <* end)
        , (flip Space SpaceMembers) <$> (map wrap $ lit "spaces" *> str <* lit "members" <* end)
        , (flip Space SpaceSetting) <$> (map wrap $ lit "spaces" *> str <* lit "setting" <* end)
       -- , (\x -> \y -> Composition x y "") <$> (lit "spaces" *> (map SpaceId str)) <*> (map FormatId str)
        , Container <$> (lit "spaces" *> (map SpaceDisplayId str)) <*> (map FormatDisplayId str) 
        , NotFound <$ (lit "not-found")
        -- crawlers
       -- , NewCrawler <$ (lit "crawlers" <* lit "new" <* end)
       -- , (flip Crawler CrawlerMain) <$> (map CrawlerId $ lit "crawlers" *> str <* end)
       -- , (flip Crawler CrawlerOperations) <$> (map CrawlerId $ lit "crawlers" *> str <* lit "operations" <* end)
       -- , Crawler <$> (lit "crawlers" *> (map CrawlerId str)) <*> (lit "operations" *> map (CrawlerOperation <<< CrawlerOperationId) (map toNumber int)) <* end
       -- , (flip Crawler CrawlerCaches) <$> (map CrawlerId $ lit "crawlers" *> str <* lit "caches" <* end)
        ]
  where
  space = map (map SpaceId) $ matchParam "space"

  format = map (map FormatId) $ matchParam "format"

  structure = map (map StructureId) $ matchParam "structure"

  content = map (map ContentId) $ matchParam "content"

pathToRoute :: String -> Route
pathToRoute path = case match matchRoute path of
  Right route -> route
  Left _ -> NotFound

foreign import pushStateImpl :: String -> Effect Unit

pushState :: forall m. MonadEffect m => Route -> m Unit
pushState route = H.liftEffect $ pushStateImpl $ routeToPath route
