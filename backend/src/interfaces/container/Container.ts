import { Container, ContentGenerator } from "../../entities/container/Container";
import { RelatedFormat, toRelatedFormat } from "../format/Format";
import { IntactReactor } from "../reactor/Reactor";
import { RelatedSpace, toRelatedSpace } from "../space/Space";
import { toTimestamp } from "../Utils";

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
    container.format.space = container.space;
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
    reactor: IntactReactor | null;
}

export function toFocusedContainer(container: Container, reactor: IntactReactor | null): FocusedContainer {
    container.format.space = container.space;
    return {
        containerId: container.entityId,
        space: toRelatedSpace(container.space),
        format: toRelatedFormat(container.format),
        createdAt: toTimestamp(container.createdAt),
        updatedAt: toTimestamp(container.updatedAt),
        generator: container.generator,
        reactor: reactor
    }
}