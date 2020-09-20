module Incentknow.Route where

import Prelude

import Data.Array (fromFoldable, toUnfoldable)
import Data.Either (Either(..))
import Data.Foldable (oneOf)
import Data.List (List(..))
import Data.List (fromFoldable) as List
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap, wrap)
import Data.Semiring.Free (free)
import Data.String (Pattern(..), joinWith, split)
import Data.Tuple (Tuple(..))
import Data.Validation.Semiring (invalid)
import Effect (Effect)
import Effect.Class (class MonadEffect)
import Effect.Class as H
import Incentknow.Data.Ids (ChangeId(..), CommunityId(..), ContentId(..), CrawlerId(..), DraftId(..), FormatId(..), OperationId(..), SemanticId(..), SnapshotId(..), SpaceId(..), UserId(..), WorkId(..))
import Routing (match)
import Routing.Match (Match(..), end, lit, int, root, str, param)
import Routing.Match.Error (MatchError(..))
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
  = SpacePages
  | SpaceContents
  | SpaceFormats
  | SpaceMembers
  | SpaceCrawlers
  | SpaceSetting

data CrawlerTab
  = CrawlerMain
  | CrawlerOperations
  | CrawlerOperation OperationId
  | CrawlerCaches

data UserTab
  = UserMain
  | UserSetting

data ContentTab
  = ContentMain

data SnapshotDiff
  = InitialSnapshot SnapshotId
  | SnapshotDiff SnapshotId SnapshotId

derive instance eqSnapshotDiff :: Eq SnapshotDiff

instance showSnapshotDiff :: Show SnapshotDiff where
  show (InitialSnapshot id) = unwrap id
  show (SnapshotDiff id1 id2) = unwrap id1 <> "-" <> unwrap id2

data Route
  = Home
  | Sign
  | User UserId UserTab
  | WorkList
  | Content ContentId
  | ContentBySemanticId FormatId SemanticId
  | EditContent ContentId
  | SpaceList
  | Composition SpaceId FormatId String
  | Public
  | JoinSpace SpaceId
  | NewContent (Maybe SpaceId) (Maybe FormatId)
  | NewFormat SpaceId
  | EditWork WorkId
  | EditScraper ContentId
  | Space SpaceId SpaceTab
  | Rivision ContentId Int
  | RivisionList ContentId
  | Snapshot WorkId ChangeId SnapshotDiff
  | NewSpace
  | Format FormatId FormatTab
  | NewCrawler
  | Crawler CrawlerId CrawlerTab
  | NotFound

derive instance eqFormatTab :: Eq FormatTab

derive instance eqSpaceTab :: Eq SpaceTab

derive instance eqCrawlerTab :: Eq CrawlerTab

derive instance eqUserTab :: Eq UserTab

derive instance eqContentTab :: Eq ContentTab

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
  Sign -> "/sign"
  Public -> "/public"
  User id UserMain -> "/users/" <> unwrap id
  User id UserSetting -> "/users/" <> unwrap id <> "/setting"
  Content id -> "/contents/" <> unwrap id
  EditContent id -> "/contents/" <> unwrap id <> "/edit"
  Rivision id ver -> "/contents/" <> unwrap id <> "/rivisions/" <> show ver
  RivisionList id -> "/contents/" <> unwrap id <> "/rivisions"
  ContentBySemanticId formatId semanticId -> "/contents/" <> unwrap formatId <> "/" <> unwrap semanticId
  -- work
  WorkList -> "/works"
  EditWork id -> "/works/" <> unwrap id <> "/edit"
  Snapshot workId changeId diff -> "/works/" <> unwrap workId <> "/" <> unwrap changeId <> "/" <> show diff
  NewFormat id -> "/spaces/" <> unwrap id <> "/formats/new"
  NewContent spaceId formatId -> "/contents/new" <> paramsToUrl [ Tuple "space" $ map unwrap spaceId, Tuple "format" $ map unwrap formatId ]
  Composition spaceId formatId tab -> "/spaces/" <> unwrap spaceId <> "/" <> unwrap formatId <> "/" <> tab
  -- communities
  SpaceList -> "/spaces"
  JoinSpace id -> "/spaces/" <> unwrap id <> "/join"
  -- space
  NewSpace -> "/spaces/new"
  EditScraper id -> "/contents/" <> unwrap id <> "/edit/scraper"
  Space id SpacePages -> "/spaces/" <> unwrap id
  Space id SpaceContents -> "/spaces/" <> unwrap id <> "/contents"
  Space id SpaceFormats -> "/spaces/" <> unwrap id <> "/formats"
  Space id SpaceMembers -> "/spaces/" <> unwrap id <> "/members"
  Space id SpaceCrawlers -> "/spaces/" <> unwrap id <> "/crawlers"
  Space id SpaceSetting -> "/spaces/" <> unwrap id <> "/setting"
  -- format
  Format id FormatMain -> "/formats/" <> unwrap id
  Format id FormatPage -> "/formats/" <> unwrap id <> "/page"
  Format id FormatVersions -> "/formats/" <> unwrap id <> "/versions"
  Format id FormatSetting -> "/formats/" <> unwrap id <> "/setting"
  Format id FormatReactor -> "/formats/" <> unwrap id <> "/reactor"

  -- crawler
  NewCrawler -> "/crawlers/new"
  Crawler id CrawlerMain -> "/crawlers/" <> unwrap id
  Crawler id CrawlerOperations -> "/crawlers/" <> unwrap id <> "/operations"
  Crawler id (CrawlerOperation ope) -> "/crawlers/" <> unwrap id <> "/operations/" <> unwrap ope
  Crawler id CrawlerCaches -> "/crawlers/" <> unwrap id <> "/caches"
  -- others
  NotFound -> "/not-found"

maybeParam :: String -> Match (Maybe String)
maybeParam key =
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

toSnapshotDiff :: String -> SnapshotDiff
toSnapshotDiff str = case List.fromFoldable $ split (Pattern "-") str of
  Cons id Nil -> InitialSnapshot (wrap id)
  Cons before (Cons after Nil) -> SnapshotDiff (wrap before) (wrap after)
  _ -> SnapshotDiff (wrap "") (wrap "")

matchRoute :: Match Route
matchRoute =
  root
    *> oneOf
        [ Home <$ end
        , Sign <$ (lit "sign" <* end)
        , Public <$ (lit "public" <* end)
        -- user
        , (flip User UserMain) <$> (map UserId $ lit "users" *> str <* end)
        , (flip User UserSetting) <$> (map UserId $ lit "users" *> str <* lit "setting" <* end)
        -- community
        , SpaceList <$ (lit "spaces" <* end)
        , JoinSpace <$> (map SpaceId $ lit "spaces" *> str <* lit "join" <* end)
        -- work
        , WorkList <$ (lit "works" <* end)
        , Snapshot <$> (lit "works" *> (map WorkId str)) <*> (map ChangeId str) <*> ((map toSnapshotDiff str) <* end)
        , EditWork <$> (map WorkId $ lit "works" *> str <* lit "edit" <* end)
        -- content
        , NewContent <$> (lit "contents" <* lit "new" *> space) <*> format <* end
        , EditScraper <$> (map ContentId $ lit "contents" *> str <* lit "edit" <* lit "scraper" <* end)
        , EditContent <$> (map ContentId $ lit "contents" *> str <* lit "edit" <* end)
        , Content <$> (map ContentId $ lit "contents" *> str <* end)
        , RivisionList <$> (map ContentId $ lit "contents" *> str <* lit "rivisions" <* end)
        , Rivision <$> (map ContentId $ lit "contents" *> str) <*> (lit "rivisions" *> int <* end)
        , ContentBySemanticId <$> (lit "contents" *> (map FormatId str)) <*> (map SemanticId str) <* end
        -- format
        , (flip Format FormatMain) <$> (map FormatId $ lit "formats" *> str <* end)
        , (flip Format FormatPage) <$> (map FormatId $ lit "formats" *> str <* lit "page" <* end)
        , (flip Format FormatVersions) <$> (map FormatId $ lit "formats" *> str <* lit "versions" <* end)
        , (flip Format FormatSetting) <$> (map FormatId $ lit "formats" *> str <* lit "setting" <* end)
        , (flip Format FormatReactor) <$> (map FormatId $ lit "formats" *> str <* lit "reactor" <* end)

        -- spaces
        , NewSpace <$ (lit "spaces" <* lit "new")
        , NewFormat <$> (map SpaceId $ lit "spaces" *> str <* lit "formats" <* lit "new" <* end)
        , (flip Space SpacePages) <$> (map SpaceId $ lit "spaces" *> str <* end)
        , (flip Space SpaceContents) <$> (map SpaceId $ lit "spaces" *> str <* lit "contents" <* end)
        , (flip Space SpaceFormats) <$> (map SpaceId $ lit "spaces" *> str <* lit "formats" <* end)
        , (flip Space SpaceMembers) <$> (map SpaceId $ lit "spaces" *> str <* lit "members" <* end)
        , (flip Space SpaceSetting) <$> (map SpaceId $ lit "spaces" *> str <* lit "setting" <* end)
        , (\x -> \y -> Composition x y "") <$> (lit "spaces" *> (map SpaceId str)) <*> (map FormatId str)
        , Composition <$> (lit "spaces" *> (map SpaceId str)) <*> (map FormatId str) <*> str
        , NotFound <$ (lit "not-found")
        -- crawlers
        , NewCrawler <$ (lit "crawlers" <* lit "new" <* end)
        , (flip Crawler CrawlerMain) <$> (map CrawlerId $ lit "crawlers" *> str <* end)
        , (flip Crawler CrawlerOperations) <$> (map CrawlerId $ lit "crawlers" *> str <* lit "operations" <* end)
        , Crawler <$> (lit "crawlers" *> (map CrawlerId str)) <*> (lit "operations" *> map (CrawlerOperation <<< OperationId) str) <* end
        , (flip Crawler CrawlerCaches) <$> (map CrawlerId $ lit "crawlers" *> str <* lit "caches" <* end)
        ]
  where
  space = map (map SpaceId) $ maybeParam "space"

  format = map (map FormatId) $ maybeParam "format"

pathToRoute :: String -> Route
pathToRoute path = case match matchRoute path of
  Right route -> route
  Left _ -> NotFound

foreign import pushStateImpl :: String -> Effect Unit

pushState :: forall m. MonadEffect m => Route -> m Unit
pushState route = H.liftEffect $ pushStateImpl $ routeToPath route
