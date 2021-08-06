import { Container, ContentGenerator } from "../../entities/container/Container";
import { Int } from "../../Implication";
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

export interface AdditionalContainerInfo {
    contentCount: Int;
    latestUpdatedAt: Date;
}

export interface FocusedContainer {
    containerId: ContainerId;
    space: RelatedSpace;
    format: RelatedFormat;
    createdAt: number;
    updatedAt: number;
    generator: ContentGenerator | null;
    reactor: IntactReactor | null;
    contentCount: Int;
    latestUpdatedAt: number;
}

export function toFocusedContainer(container: Container, reactor: IntactReactor | null, additional: AdditionalContainerInfo): FocusedContainer {
    container.format.space = container.space;
    return {
        containerId: container.entityId,
        space: toRelatedSpace(container.space),
        format: toRelatedFormat(container.format),
        createdAt: toTimestamp(container.createdAt),
        updatedAt: toTimestamp(container.updatedAt),
        generator: container.generator,
        reactor: reactor,
        contentCount: additional.contentCount,
        latestUpdatedAt: toTimestamp(additional.latestUpdatedAt)
    }
}