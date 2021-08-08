module Incentknow.Atoms.Icon where

import Prelude

import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.API.Execution (Remote(..))
import Incentknow.Data.Entities (FocusedSpace, MembershipMethod(..), PropertyInfo, RelatedUser, SpaceAuth(..), Type(..), TypeName(..))
import Incentknow.Data.EntityUtils (getTypeName)
import Incentknow.HTML.Utils (css, maybeElem)

loadingWith :: forall w i. String -> HH.HTML w i
loadingWith msg =
  HH.div
    [ css "atom-loading-icon"
    ]
    [ HH.div
        [ css "text" ]
        [ HH.text msg ]
    , HH.div
        [ css "icon loaderCircle" ]
        []
    ]

remoteWith :: forall a w i. Remote a -> (a -> HH.HTML w i) -> HH.HTML w i
remoteWith remote body = case remote of
  Loading -> HH.text ""
  LoadingForServer -> HH.div [ css "atom-remote-loading" ] [ HH.div [ css "loaderNormal" ] [] ]
  Holding item -> body item
  Missing error -> HH.text error

iconButton :: forall a s m. String -> a -> H.ComponentHTML a s m
iconButton cls onClick = HH.i [ css cls, HE.onClick $ \_ -> Just onClick ] []

icon :: forall w i. String -> HH.HTML w i
icon cls = HH.i [ css cls ] []

iconSolid :: forall w i. String -> HH.HTML w i
iconSolid label = HH.i [ css $ "fas fa-" <> label ] []

spaceScopeIcon :: forall w i. FocusedSpace -> HH.HTML w i
spaceScopeIcon space =
  HH.span [ css "atom-space-scope" ]
    if space.defaultAuthority == SpaceAuthNone && space.membershipMethod == MembershipMethodNone then
      [ HH.span [ css "icon private" ] [ icon "fas fa-lock", HH.text "Private" ]
      ]
    else if space.defaultAuthority == SpaceAuthNone then
      [ HH.span [ css "icon group" ] [ icon "fas fa-users", HH.text "Group" ]
      ]
    else 
      [ HH.span [ css "icon public" ] [ icon "fas fa-globe-americas", HH.text "Public" ]
      ]
  
userIcon :: forall w i. RelatedUser -> HH.HTML w i
userIcon user =
  HH.span [ css "atom-user-icon" ]
    [ HH.img [ HP.src "/assets/imgs/default_icon.jpg" ]
    , HH.span [ css "username" ] [ HH.text user.displayName ]
    ]

formatWithIcon :: forall w i a. { displayName :: String, icon :: Maybe String | a } -> HH.HTML w i
formatWithIcon format =
  HH.span [ css "atom-format-with-icon" ] 
    [ maybeElem format.icon \label->
        iconSolid label
    , HH.text format.displayName 
    ]

typeIcon :: forall w i. TypeName -> HH.HTML w i
typeIcon typeName = if label == "" then HH.text "" else icon label
  where
  label = case typeName of
    TypeNameInt -> "fas fa-hashtag"
    TypeNameBool -> "fas fa-check-square"
    TypeNameString -> "fas fa-text"
    TypeNameContent -> "fas fa-file"
    TypeNameUrl -> "fas fa-link"
    TypeNameObject -> "fas fa-brackets-curly"
    TypeNameText -> "fas fa-align-left"
    TypeNameArray -> "fas fa-brackets"
    TypeNameEnum -> "fas fa-tags"
    TypeNameDocument -> "fas fa-file-alt"
    TypeNameImage -> "fas fa-images"
    TypeNameEntity -> ""

propertyIcon :: forall w i. PropertyInfo -> HH.HTML w i
propertyIcon prop =
  case prop.type of
    ContentType format -> 
      case format.icon of
          Just i -> iconSolid i
          Nothing -> 
            case prop.icon of
              Just i -> iconSolid i
              Nothing -> typeIcon $ getTypeName prop.type
    ty -> 
      case prop.icon of
        Just i -> iconSolid i
        Nothing -> typeIcon $ getTypeName ty