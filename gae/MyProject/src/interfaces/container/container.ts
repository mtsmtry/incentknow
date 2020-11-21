import { Container, ContentGenerator } from "../../entities/container/container";
import { Reactor } from "../../entities/reactor/reactor";
import { RelatedFormat, toRelatedFormat } from "../format/format";
import { ReactorId } from "../reactor/reactor";
import { RelatedSpace, toRelatedSpace } from "../space/space";

export type ContainerId = string;

export interface RelatedContainer {
    containerId: ContainerId;
    space: RelatedSpace;
    format: RelatedFormat;
    createdAt: number;
    updatedAt: number;
    generator: ContentGenerator | null;
}

export function toRelatedContainer(container: Container): RelatedContainer {
    return {
        containerId: container.entityId,
        space: toRelatedSpace(container.space),
        format: toRelatedFormat(container.format),
        createdAt: toTimestamp(container.createdAt),
        updatedAt: toTimestamp(container.updatedAt),
        generator: container.generator
    }
}

export interface FocusedContainer {
    containerId: ContainerId;
    space: RelatedSpace;
    format: RelatedFormat;
    createdAt: number;
    updatedAt: number;
    generator: ContentGenerator | null;
    reactorId: ReactorId | null;
}

export function toFocusedContainer(container: Container, reactor: Reactor | null): FocusedContainer {
    return {
        containerId: container.entityId,
        space: toRelatedSpace(container.space),
        format: toRelatedFormat(container.format),
        createdAt: toTimestamp(container.createdAt),
        updatedAt: toTimestamp(container.updatedAt),
        generator: container.generator,
        reactorId: reactor?.entityId
    }
}