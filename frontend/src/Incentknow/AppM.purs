module Incentknow.AppM where

import Prelude

import Control.Monad.State (class MonadState, StateT(..), gets, modify_, runStateT)
import Control.Monad.Trans.Class (lift)
import Data.Maybe (Maybe)
import Data.Tuple (Tuple(..))
import Effect.AVar (AVar)
import Effect.Aff (Aff)
import Effect.Aff.AVar (put)
import Effect.Aff.AVar as AVar
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Incentknow.Data.Entities (IntactAccount)
import Incentknow.Route (Route)
import Routing.PushState (PushStateInterface)
import Type.Equality (class TypeEquals, from, to)
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
    , account :: Maybe IntactAccount
    }

newtype AppM a
  = AppM (StateT Env Aff a)

runAppM :: forall a. Env -> AppM a -> Aff a
runAppM env (AppM m) = do
  (Tuple a _) <- runStateT m env
  pure a

derive newtype instance functorAppM :: Functor AppM

derive newtype instance applyAppM :: Apply AppM

derive newtype instance applicativeAppM :: Applicative AppM

derive newtype instance bindAppM :: Bind AppM

derive newtype instance monadAppM :: Monad AppM

derive newtype instance monadEffectAppM :: MonadEffect AppM

derive newtype instance monadAffAppM :: MonadAff AppM

-- AppM a = AppM (StateT Env Aff a) = AppM(StateT (Env -> Aff (Tuple a Env)))
instance monadStateAppM :: TypeEquals e Env => MonadState e AppM where
  -- state :: forall a. (e -> (Tuple a e)) -> AppM a
  -- state :: forall a. (e -> (Tuple a e)) -> AppM(StateT (Env -> Aff (Tuple a Env)))
  state f = AppM $ StateT $ \env-> let (Tuple a newEnv) = f (from env) in pure $ Tuple a $ to newEnv

class
  MonadEffect m <= Behaviour m where
  navigate :: Route -> m Unit
  pushState :: Route -> m Unit
  message :: Message -> m Unit
  resetMessage :: m Unit
  startLoading :: m Unit
  stopLoading :: m Unit
  setAccount :: Maybe IntactAccount -> m Unit
  getAccount :: m (Maybe IntactAccount)
  getPushStateInterface :: m PushStateInterface
  takeGlobalMessage :: m GlobalMessage

-- instance aaa :: Behaviour m => MonadEffect m

instance behaviourHalogenM :: Behaviour m => Behaviour (H.HalogenM st act slots msg m) where
  navigate = lift <<< navigate
  pushState = lift <<< pushState
  message = lift <<< message
  resetMessage = lift resetMessage
  startLoading = lift startLoading
  stopLoading = lift stopLoading
  setAccount = lift <<< setAccount
  getAccount = lift getAccount
  getPushStateInterface = lift getPushStateInterface
  takeGlobalMessage = lift takeGlobalMessage

instance behaviourAppM :: Behaviour AppM where
  pushState route = do
    globalMessage <- gets _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
    liftAff $ put (PushStateG route) globalMessage
  navigate route = do
    globalMessage <- gets _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
    liftAff $ put (NavigateG route) globalMessage
  resetMessage = do
    globalMessage <- gets _.globalMessage
    liftAff $ put ResetMesssageG globalMessage
  message msg = do
    globalMessage <- gets _.globalMessage
    liftAff $ put (MessageG msg) globalMessage
  startLoading = do
    globalMessage <- gets _.globalMessage
    liftAff $ put StartLoadingG globalMessage
  stopLoading = do
    globalMessage <- gets _.globalMessage
    liftAff $ put StopLoadingG globalMessage
  setAccount x = modify_ _ { account = x }
  getAccount = gets _.account
  getPushStateInterface = gets _.pushStateInterface
  takeGlobalMessage = do
    globalMessage <- gets _.globalMessage
    query <- H.liftAff $ AVar.take globalMessage
    pure query

navigateRoute :: forall m. Behaviour m => MouseEvent -> Route -> m Unit
navigateRoute event route = do
  H.liftEffect $ preventDefault $ toEvent event
  navigate route