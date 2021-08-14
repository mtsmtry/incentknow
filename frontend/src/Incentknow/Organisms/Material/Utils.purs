module Incentknow.Organisms.Material.Utils where

import Prelude

import Effect.Class (class MonadEffect)
import Halogen as H
import Incentknow.Data.Entities (BlockData(..), MaterialData(..), MaterialType(..))
import Incentknow.Organisms.Document.Editor (generateDocumentBlockId)

createNewMaterialData :: forall m. MonadEffect m => MaterialType -> m MaterialData
createNewMaterialData = case _ of
  MaterialTypeDocument -> do
    newId <- H.liftEffect generateDocumentBlockId
    let document = { blocks: [{ id: newId, data: ParagraphBlockData "" }] }
    pure $ DocumentMaterialData document
  MaterialTypePlaintext -> do
    pure $ PlaintextMaterialData