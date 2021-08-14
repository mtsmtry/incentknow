import { MaterialType } from "../../entities/material/Material";
import { MaterialSnapshot } from "../../entities/material/MaterialSnapshot";
import { toTimestamp } from "../Utils";
import { MaterialData, toMaterialData } from "./Material";

export interface RelatedMaterialSnapshot {
    textCount: number;
    displayName: string;
    timestamp: number;
}

export function toRelatedMaterialSnapshot(snapshot: MaterialSnapshot): RelatedMaterialSnapshot {
    return {
        textCount: snapshot.textCount,
        displayName: snapshot.beginning,
        timestamp: toTimestamp(snapshot.timestamp)
    }
}

export interface FocusedMaterialSnapshot {
    data: MaterialData;
    textCount: number;
    displayName: string;
    timestamp: number;
}

export function toFocusedMaterialSnapshot(snapshot: MaterialSnapshot, materialType: MaterialType): FocusedMaterialSnapshot {
    return {
        data: toMaterialData(materialType, snapshot.data),
        textCount: snapshot.textCount,
        displayName: snapshot.beginning,
        timestamp: toTimestamp(snapshot.timestamp)
    }
}