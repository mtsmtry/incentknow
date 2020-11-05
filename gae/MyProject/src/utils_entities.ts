import { count } from "console";
import { StringLiteral } from "typescript";
import { Container, Content, ContentCommit, ContentDraft, ContentEditing, ContentGenerator, ContentSnapshot, EditingState, Format, FormatUsage, Language, Material, MaterialCommit, MaterialDraft, MaterialEditing, MaterialSnapshot, MaterialType, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";

function toTimestamp(date: Date) {
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}

//====================================================================================================
// Container
//====================================================================================================

export type ContainerId = string;

export interface IntactContainer {
    entityId: ContainerId;
    space: RelatedSpace;
    format: RelatedFormat;
    createdAt: number;
    updatedAt: number;
}

export function toIntactContainer(container: Container): IntactContainer {
    return {
        entityId: container.entityId,
        space: toRelatedSpace(container.space),
        format: toRelatedFormat(container.format),
        createdAt: toTimestamp(container.createdAt),
        updatedAt: toTimestamp(container.updatedAt)
    }
}

//====================================================================================================
// Space
//====================================================================================================

// Space ------------------------------

export type SpaceId = string;

export type SpaceDisplayId = string;

export interface RelatedSpace {
    entityId: SpaceId;
    displayId: SpaceDisplayId;
    displayName: string;
    description: string;
    createdAt: number;
    homeUrl: string | null;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuth;
}

export function toRelatedSpace(space: Space): RelatedSpace {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}

export interface FocusedSpace {
    entityId: SpaceId;
    displayId: SpaceDisplayId;
    displayName: string;
    description: string;
    creatorUser: RelatedUser,
    createdAt: number;
    homeUrl: string | null;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuth;
}

export function toFocusedSpace(space: Space): FocusedSpace {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: toRelatedUser(space.creatorUser),
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}

// SpaceMember ------------------------------

export interface FocusedSpaceMember {
    user: RelatedUser;
    joinedAt: number;
    type: MemberType;
}

export function toFocusedSpaceMember(member: SpaceMember): FocusedSpaceMember {
    return {
        user: toRelatedUser(member.user),
        joinedAt: toTimestamp(member.joinedAt),
        type: member.type
    }
}

//====================================================================================================
// User
//====================================================================================================

// User ------------------------------

export type UserId = string;

export type UserDisplayId = string;

export interface RelatedUser {
    entityId: UserId;
    displayId: UserDisplayId;
    displayName: string;
    iconUrl: string | null;
    createdAt: number;
}

export function toRelatedUser(user: User): RelatedUser {
    return {
        entityId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    }
}

export interface FocusedUser {
    entityId: UserId;
    displayId: UserDisplayId;
    displayName: string;
    iconUrl: string | null;
    createdAt: number;
}

export function toFocusedUser(user: User): FocusedUser {
    return {
        entityId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    }
}

//====================================================================================================
// Format
//====================================================================================================

// Structure ------------------------------

export interface PropertyInfo {
    displayName: string,
    fieldName: string | null,
    id: string,
    optional: boolean,
    semantic: string | null,
    type: Type
}

export interface TypeArguments {
    format?: string;
    type?: Type;
    language?: Language;
    properties?: PropertyInfo[];
}

export interface Type {
    name: TypeName;
    arguments: TypeArguments;
}

export function toPropertyInfo(prop: Property): PropertyInfo {
    const res: PropertyInfo = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        type: {
            name: prop.typeName,
            arguments: {}
        }
    }

    if (prop.typeName == TypeName.ARRAY) {
        res.type.arguments = {
            type: {
                name: prop.argType,
                arguments: {
                    format: prop.argFormat?.entityId,
                    language: prop.argLanguage,
                    properties: prop.argProperties.map(toPropertyInfo)
                }
            }
        };
    } else {
        res.type.arguments = {
            format: prop.argFormat?.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo)
        };
    }

    return res;
}

export type StructureId = string;

export interface FocusedStructure {
    entityId: StructureId;
    properties: PropertyInfo[];
    createdAt: number;
}

export function toFocusedStructure(structure: Structure): FocusedStructure {
    return {
        entityId: structure.entityId,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: toTimestamp(structure.createdAt)
    };
}

// Format ------------------------------

export type FormatId = string;

export type FormatDisplayId = string;

export interface RelatedFormat {
    entityId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    space: RelatedSpace;
    generator: ContentGenerator;
    usage: FormatUsage;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
}

export function toRelatedFormat(format: Format): RelatedFormat {
    return {
        entityId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        generator: format.generator,
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser)
    }
}

export interface FocusedFormat {
    entityId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    space: RelatedSpace;
    generator: ContentGenerator;
    usage: FormatUsage;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    structure: FocusedStructure;
}

export function toFocusedFormat(format: Format): FocusedFormat {
    return {
        entityId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        generator: format.generator,
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser),
        structure: toFocusedStructure(format.currentStructure)
    }
}

export function toFocusedFormatFromStructure(structure: Structure): FocusedFormat {
    return {
        entityId: structure.format.entityId,
        displayId: structure.format.displayId,
        displayName: structure.format.displayName,
        description: structure.format.description,
        space: toRelatedSpace(structure.format.space),
        generator: structure.format.generator,
        usage: structure.format.usage,
        createdAt: toTimestamp(structure.format.createdAt),
        creatorUser: toRelatedUser(structure.format.creatorUser),
        updatedAt: toTimestamp(structure.format.updatedAt),
        updaterUser: toRelatedUser(structure.format.updaterUser),
        structure: toFocusedStructure(structure)
    }
}

//====================================================================================================
// Content
//====================================================================================================

// Content ------------------------------

export type ContentId = string;

export interface FocusedContent {
    entityId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: number;
    viewCount: number;
    format: FocusedFormat;
    draft: ContentDraft;
    data: any;
}

export function toFocusedContent(content: Content, draft: ContentDraft, format: FocusedFormat): FocusedContent {
    return {
        entityId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        draft: draft,
        data: content.data
    };
}

// Content Commit ------------------------------

export type ContentCommitId = string;

export interface RelatedContentCommit {
    entityId: ContentCommitId;
    timestamp: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toRelatedContentCommit(commit: ContentCommit): RelatedContentCommit {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedContentCommit {
    entityId: ContentCommitId;
    timestamp: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toFocusedContentCommit(commit: ContentCommit): FocusedContentCommit {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

// Content Draft ------------------------------

export type ContentDraftId = string;

export interface RelatedContentDraft {
    entityId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    forkedCommitId: string;
}

export function toRelatedContentDraft(draft: ContentDraft): RelatedContentDraft {
    return {
        entityId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        forkedCommitId: draft.forkedCommit?.entityId,
    }
}

export interface FocusedContentDraft {
    entityId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    forkedCommitId: string;
    data: string;
    materialDrafts: FocusedMaterialDraft[];
}

export function toFocusedContentDraft(draft: ContentDraft, materialDrafts: MaterialDraft[]): FocusedContentDraft {
    return {
        entityId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        forkedCommitId: draft.forkedCommit.entityId,
        data: draft.data,
        materialDrafts: materialDrafts.map(toFocusedMaterialDraft)
    }
}

//====================================================================================================
// Material
//====================================================================================================

// Material ------------------------------

export type MaterialId = string;

export interface RelatedMaterial {
    entityId: MaterialId;
    contentId: string;
    displayName: string;
    materialType: MaterialType;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
}

export function toRelatedMaterial(material: Material): RelatedMaterial {
    return {
        entityId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser)
    };
}

export interface FocusedMaterial {
    entityId: MaterialId;
    contentId: string;
    displayName: string;
    materialType: MaterialType;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    data: string;
    draft: RelatedMaterialDraft
}

export function toFocusedMaterial(material: Material, draft: MaterialDraft): FocusedMaterial {
    return {
        entityId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser),
        data: material.data,
        draft: toRelatedMaterialDraft(draft)
    };
}

// Material Commit ------------------------------

export type MaterialCommitId = string;

export interface RelatedMaterialCommit {
    entityId: MaterialCommitId;
    timestamp: number;
    dataSize: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toRelatedMaterialCommit(commit: MaterialCommit): RelatedMaterialCommit {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedMaterialCommit {
    entityId: MaterialCommitId;
    timestamp: number;
    data: string;
    dataSize: number;
}

export function toFocusedMaterialCommit(commit: MaterialCommit): FocusedMaterialCommit {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        dataSize: commit.dataSize
    }
}

// Material Draft ------------------------------

export type MaterialDraftId = string;

export interface RelatedMaterialDraft {
    entityId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
}

export function toRelatedMaterialDraft(draft: MaterialDraft): RelatedMaterialDraft {
    return {
        entityId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
    };
}

export interface FocusedMaterialDraft {
    entityId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
    contentDraftId: string;
    material: RelatedMaterial;
    forkedCommitId: string;
    data: string;
}

export function toFocusedMaterialDraft(draft: MaterialDraft): FocusedMaterialDraft {
    return {
        entityId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        contentDraftId: draft.intendedContentDraft?.entityId,
        material: toRelatedMaterial(draft.material),
        forkedCommitId: draft.forkedCommit.entityId,
        data: draft.data
    };
}

//====================================================================================================
// Node, Snapshot
//====================================================================================================

// [基本的な履歴管理の説明]
// Content/MaterialとCommitのデータ部分をSnapshotに統合することは可能ですが、
// 以下の三層を疎結合にするために、分離する設計を取っていいます。
//      [実データ層] Content/Material
//      [編集履歴層] Commit
//      [個人編集層]
//          Draft: 永続的な編集の記録。
//          Editing: 個人的な編集の単位。
//          Snapshot: 個人的な変更されることのないデータ。何かのEditingに属する。
// 1. 実データ層と編集履歴層を分離することで、実体の種類によって編集履歴機能を有効にするかを、設定できるようにできます。
//      ユースケース1) 外部からの大量なデータのインポート時に、編集履歴機能を使用しないことで高速化できる
//      ユースケース2) リアルタイム共同編集機能がオンの時に、直接データを取得する
// 2. 編集履歴層と個人編集層を分離することで、一定期間が経過した個人編集層のデータを削除することができます。
//      例えば、CommitとSnapshotが統合されていれば、タイムスタンプでパーティショニングを行い、古いパーティションテーブルごと削除するといったことはできません。

// [履歴表示戦略の説明]
// ユーザー側からは、前述の三層の区別は隠蔽されます。
// ユーザーがバージョンを参照する際に必要な概念は以下の二つのみです。
// 1. Node
//      Nodeは、編集の単位であり、一連の編集プロセスを示します。
//      Nodeは、子要素として複数のSnapshotを持ちますが、Node自体もSnapshotの具象です。
//      全てのCommit, Commitしていない全てのEditing, DraftからNodeは生成されます。
// 2. Snapshot (RDBのSnapshotとは異なります)
//      タイムスタンプ、データ、作成者のみを示すシンプルなものです。
//      Commit, Draft, Snapshotから生成されます。

export enum SnapshotSource {
    COMMIT = "commit",
    SNAPSHOT = "snapshot",
    EDITING = "editing", // the latest snapshot of the specified editing
    DRAFT = "draft"
}

export enum NodeType {
    COMMITTED = "committed",
    PRESENT = "present",
    CANCELD = "canceled"
}

function toNodeTypeFromEditingState(state: EditingState): NodeType | null {
    switch (state) {
        case EditingState.CANCELD:
            return NodeType.CANCELD;
        case EditingState.EDITING:
            return NodeType.PRESENT;
        case EditingState.COMMITTED:
            return null;
    }
}

// Material Snapshot ------------------------------

export interface RelatedMaterialSnapshot {
    source: SnapshotSource;
    entityId: string;
    timestamp: number;
    dataSize: number;
}

export interface FocusedMaterialSnapshot {
    timestamp: number;
    data: string;
}

export function toFocusedMaterialSnapshotFromSnapshot(snapshot: MaterialSnapshot): FocusedMaterialSnapshot {
    return {
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data
    }
}

export function toFocusedMaterialSnapshotFromCommit(commit: MaterialCommit): FocusedMaterialSnapshot {
    return {
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data
    }
}

export function toFocusedMaterialSnapshotFromDraft(draft: MaterialDraft): FocusedMaterialSnapshot {
    return {
        timestamp: toTimestamp(draft.updatedAt),
        data: draft.data
    }
}

// Material Node ------------------------------

export interface MaterialNode {
    type: NodeType;
    user: RelatedUser;
    editingId: string | null;
    snapshot: RelatedMaterialSnapshot;
}

export function toRelatedMaterialSnapshotFromEditing(editing: MaterialEditing): RelatedMaterialSnapshot {
    return {
        source: SnapshotSource.EDITING,
        timestamp: toTimestamp(editing.createdAt),
        entityId: editing.entityId,
        dataSize: 0,
    };
}

export function toRelatedMaterialSnapshotFromCommit(commit: MaterialCommit): RelatedMaterialSnapshot {
    return {
        source: SnapshotSource.COMMIT,
        timestamp: toTimestamp(commit.timestamp),
        entityId: commit.entityId,
        dataSize: commit.dataSize,
    };
}


export function toRelatedMaterialSnapshotFromSnapshot(snapshot: MaterialSnapshot): RelatedMaterialSnapshot {
    return {
        source: SnapshotSource.SNAPSHOT,
        timestamp: toTimestamp(snapshot.timestamp),
        entityId: snapshot.entityId,
        dataSize: snapshot.dataSize,
    };
}

export function toMaterialNodes(editings: MaterialEditing[], commits: MaterialCommit[]): MaterialNode[] {
    const editingDict: { [id: number]: MaterialEditing } = editings.reduce((prev, x) => prev[x.id] = x, {});

    function fromEditing(editing: MaterialEditing): MaterialNode {
        const type = toNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }

        return {
            type: type,
            user: toRelatedUser(editing.user),
            editingId: editing.entityId,
            snapshot: toRelatedMaterialSnapshotFromEditing(editing)
        };
    }

    function fromCommit(commit: MaterialCommit): MaterialNode {
        return {
            type: NodeType.COMMITTED,
            user: toRelatedUser(commit.committerUser),
            editingId: editingDict[commit.editingId]?.entityId,
            snapshot: toRelatedMaterialSnapshotFromCommit(commit)
        };
    }

    return editings.map(fromEditing).filter(x => x).concat(commits.map(fromCommit));
}

// Content Node ------------------------------

// [Contentの履歴表示戦略]
// 子要素のMaterialも含めて、包括的なNodeとSnapshotを生成する

export enum NodeTarget {
    CONTENT = "content",
    MATERIAL = "material",
    WHOLE = "whole"
}

export interface ContentNode {
    type: NodeType;
    target: NodeTarget;
    user: RelatedUser;
    editingId: string | null;
    snapshot: RelatedContentSnapshot;
}

function groupBy<T>(array: T[], getKey: (obj: T) => number): { [key: number]: T[] } {
    return array.reduce((map: { [key: number]: T[] }, x) => {
        const key = getKey(x);
        (map[key] || (map[key] = [])).push(x);
        return map;
    }, {});
}

function mapBy<T>(array: T[], getKey: (obj: T) => number): { [key: number]: T } {
    return array.reduce((map, x) => map[getKey(x)] = x, {});
}

export function toContentNodes(
        editings: ContentEditing[],
        commits: ContentCommit[],
        materialEditings: MaterialEditing[],
        materialCommits: MaterialCommit[]
        ): ContentNode[] {

    const editingDict = mapBy(editings, x => x.id);
    const materialEditingDict = mapBy(materialEditings, x => x.id);
    const materialCommitsByParent = groupBy(materialCommits, x => x.parentCommitId);
    const materialEditingsByParent = groupBy(materialEditings, x => x.parentEditingId);

    function fromEditing(editing: ContentEditing): ContentNode {
        const type = toNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }

        const materials = materialEditingsByParent[editing.id].map(toRelatedMaterialSnapshotFromEditing);

        return {
            type: type,
            target: materials.length > 0 ? NodeTarget.WHOLE : NodeTarget.CONTENT,
            user: toRelatedUser(editing.user),
            editingId: editing.entityId,
            snapshot: {
                source: SnapshotSource.EDITING,
                timestamp: toTimestamp(editing.createdAt),
                entityId: editing.entityId,
                materials
            }
        };
    }

    function fromCommit(commit: ContentCommit): ContentNode {
        const materials = materialCommitsByParent[commit.id].map(toRelatedMaterialSnapshotFromCommit);

        return {
            type: NodeType.COMMITTED,
            target: materials.length > 0 ? NodeTarget.WHOLE : NodeTarget.CONTENT,
            user: toRelatedUser(commit.committerUser),
            editingId: editingDict[commit.editingId]?.entityId,
            snapshot: {
                source: SnapshotSource.COMMIT,
                timestamp: toTimestamp(commit.timestamp),
                entityId: commit.entityId,
                materials
            }
        };
    }
    /*
    function fromMaterialCommit(commit: MaterialCommit): ContentNode {
        return {
            type: NodeType.COMMITTED,
            target: NodeTarget.MATERIAL,
            user: toRelatedUser(commit.committerUser),
            editingId: materialEditingDict[commit.id]?.entityId,
            snapshot: {
                source: null,
                timestamp: null,
                entityId: null,
                materials: [ {
                    source: 0,
                    entityId: materialEditingDict[commit.id]?.entityId,
                } ]
            }
        }
    }
    */
    return editings.map(fromEditing).filter(x => x).concat(commits.map(fromCommit));
}

// Content Snapshot ------------------------------

export interface RelatedContentSnapshot {
    source: SnapshotSource;
    entityId: string;
    timestamp: number;
    materials: RelatedMaterialSnapshot[];
}

export function toRelatedContentSnapshotFromSnapshot(snapshot: ContentSnapshot, materials: RelatedMaterialSnapshot[]): RelatedContentSnapshot {
    return {
        source: SnapshotSource.SNAPSHOT,
        entityId: snapshot.entityId,
        timestamp: toTimestamp(snapshot.timestamp),
        materials
    }
}

export interface FocusedContentSnapshot {
    timestamp: number;
    data: string;
    materials: FocusedMaterialSnapshot[];
}

export function toFocusedContentSnapshotFromSnapshot(snapshot: ContentSnapshot, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data,
        materials
    }
}

export function toFocusedContentSnapshotFromCommit(commit: ContentCommit, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        materials
    }
}

export function toFocusedContentSnapshotFromDraft(draft: ContentDraft, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(draft.updatedAt),
        data: draft.data,
        materials
    }
}