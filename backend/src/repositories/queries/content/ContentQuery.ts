import { SelectQueryBuilder } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { PropertyId, TypeName } from "../../../entities/format/Property";
import { StructureSk } from "../../../entities/format/Structure";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContent, toRelatedContent } from "../../../interfaces/content/Content";
import { RelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { mapBy } from "../../../Utils";
import { ContentEditingRepository } from "../../implements/content/ContentEditingRepository";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class ContentQuery extends SelectFromSingleTableQuery<Content, ContentQuery, ContentSk, ContentId, null> {
    constructor(qb: SelectQueryBuilder<Content>) {
        super(qb, ContentQuery);
    }

    byContainer(containerId: ContainerSk) {
        return new ContentQuery(this.qb.where({ containerId }));
    }

    bySpace(spaceId: SpaceSk) {
        const query = this.qb
            .innerJoin("x.container", "container")
            .where("container.spaceId = :spaceId", { spaceId });
        return new ContentQuery(query);
    }

    byProperty(containerId: ContainerSk, propertyId: PropertyId, value: any) {
        const query = this.qb.where({ containerId }).andWhere(`x.data->>"$.${propertyId}" = :value`, { value });
        return new ContentQuery(query);
    }

    latest() {
        return new ContentQuery(this.qb.orderBy("x.updatedAt", "DESC"));
    }

    limit(count: number) {
        return new ContentQuery(this.qb.limit(count));
    }

    private async locateRelatedContents(rep: ContentRepository, data: any, format: FocusedFormat) {
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (prop.type.name == TypeName.CONTENT && prop.type.format) {
                const [buildContent, raw] = await rep.fromContents().byEntityId(value).selectRelated().getNeededOneWithRaw();
                data[prop.id] = buildContent(prop.type.format);
            }
        });
        await Promise.all(promises);
    }

    private selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .addSelect("x.data");;

        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContent(x, f));
    }

    private selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.materials", "materials")
            .addSelect("x.data");

        return mapQuery(query, x => (f: FocusedFormat, d: RelatedContentDraft | null) => toFocusedContent(x, d, f));
    }

    async getRelatedMany(rep: ContentRepository, formatRep: FormatRepository) {
        const contents = await this.selectRelated().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [buildFormat, struct] = await getFormat(x);
            const relations = await formatRep.getRelations(struct.formatId);
            const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedContents = contents.map(x => x.result(structMap[x.raw.structureId].format));

        // Related contents
        await Promise.all(focusedContents.map(x => this.locateRelatedContents(rep, x.data, x.format)));

        return focusedContents;
    }

    async getFocusedMany(userId: UserSk | null, rep: ContentRepository, formatRep: FormatRepository, editRep: ContentEditingRepository) {
        const contents = await this.selectFocused().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [buildFormat, struct] = await getFormat(x);
            const relations = await formatRep.getRelations(struct.formatId);
            const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Drafts
        const focusedContents = await Promise.all(contents.map(async x => {
            const format = structMap[x.raw.structureId].format;
            if (userId) {
                const buildDraft = await editRep.fromDrafts().byUser(userId).byContent(x.raw.id).selectRelated().getNeededOne();
                const draft = buildDraft(format);
                return x.result(format, draft);
            }
            return x.result(format, null);
        }));

        // Related contents
        await Promise.all(focusedContents.map(x => this.locateRelatedContents(rep, x.data, x.format)));

        return focusedContents;
    }

    selectAll() {
        return new ContentQuery(this.qb.addSelect("x.data"));
    }
}

export class ContentQueryFromEntity extends SelectQueryFromEntity<Content> {
    constructor(content: Content) {
        super(content);
    }
}