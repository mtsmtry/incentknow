module Incentknow.AppM where

import Prelude

import Control.Monad.Reader.Trans (class MonadAsk, ReaderT, asks, runReaderT)
import Control.Monad.Trans.Class (lift)
import Effect.AVar (AVar)
import Effect.Aff (Aff)
import Effect.Aff.AVar (put)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Effect.Console as Console
import Halogen as H
import Incentknow.Route (Route)
import Routing.PushState (PushStateInterface)
import Type.Equality (class TypeEquals, from)
import Web.Event.Event (preventDefault)
import Web.UIEvent.MouseEvent (MouseEvent, toEvent)

data Message
  = Error String
  | Success String

data GlobalMessage
  = NavigateG Route
  | PushStateG Route
  | StartLoadingG
  | StopLoadingG
  | MessageG Message
  | ResetMesssageG

type Env
  = { globalMessage :: AVar GlobalMessage
    , pushStateInterface :: PushStateInterface
    }

newtype AppM a
  = AppM (ReaderT Env Aff a)

runAppM :: Env -> AppM ~> Aff
runAppM env (AppM m) = runReaderT m env

derive newtype instance functorAppM :: Functor AppM

derive newtype instance applyAppM :: Apply AppM

derive newtype instance applicativeAppM :: Applicative AppM

derive newtype instance bindAppM :: Bind AppM

derive newtype instance monadAppM :: Monad AppM

derive newtype instance monadEffectAppM :: MonadEffect AppM

derive newtype instance monadAffAppM :: MonadAff AppM

instance monadAskAppM :: TypeEquals e Env => MonadAsk e AppM where
  ask = AppM $ asks from

class
  MonadEffect m <= Behaviour m where
  navigate :: Route -> m Unit
  pushState :: Route -> m Unit
  message :: Message -> m Unit
  resetMessage :: m Unit
  startLoading :: m Unit
  stopLoading :: m Unit

-- instance aaa :: Behaviour m => MonadEffect m

instance behaviourHalogenM :: Behaviour m => Behaviour (H.HalogenM st act slots msg m) where
  navigate = lift <<< navigate
  pushState = lift <<< pushState
  message = lift <<< message
  resetMessage = lift resetMessage
  startLoading = lift startLoading
  stopLoading = lift stopLoading

instance behaviourAppM :: Behaviour AppM where
  pushState route = do
    globalMessage <- asks _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
    liftAff $ put (PushStateG route) globalMessage
  navigate route = do
    globalMessage <- asks _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
    liftAff $ put (NavigateG route) globalMessage
  resetMessage = do
    globalMessage <- asks _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
  message msg = do
    globalMessage <- asks _.globalMessage
    liftAff $ put (MessageG msg) globalMessage
  startLoading = do
    H.liftEffect $ Console.log "start &&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    globalMessage <- asks _.globalMessage
    liftAff $ put StartLoadingG globalMessage
  stopLoading = do
    H.liftEffect $ Console.log "stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    globalMessage <- asks _.globalMessage
    liftAff $ put StopLoadingG globalMessage

navigateRoute :: forall m. Behaviour m => MouseEvent -> Route -> m Unit
navigateRoute event route = do
  H.liftEffect $ preventDefault $ toEvent event
  navigate route