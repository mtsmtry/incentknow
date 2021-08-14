import { MaterialEditing, MaterialEditingId } from "../../entities/material/MaterialEditing";
import { toTimestamp } from "../Utils";

export interface IntactMaterialEditing {
    materialEditingId: MaterialEditingId;
    createdAt: number;
    updatedAt: number;
}

export function toIntactMaterialEditing(editing: MaterialEditing): IntactMaterialEditing {
    return {
        materialEditingId: editing.entityId,
        createdAt: toTimestamp(editing.createdAt),
        updatedAt: toTimestamp(editing.updatedAt)
    }
}