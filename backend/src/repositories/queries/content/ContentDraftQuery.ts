import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentDraft, ContentDraftId, ContentDraftSk } from "../../../entities/content/ContentDraft";
import { StructureSk } from "../../../entities/format/Structure";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContentDraft, toRelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { InternalError } from "../../../services/Errors";
import { mapBy } from "../../../Utils";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";
import { ContentQuery } from "./ContentQuery";

export class ContentDraftQuery extends SelectFromSingleTableQuery<ContentDraft, ContentDraftQuery, ContentDraftSk, ContentDraftId, null>  {
    constructor(qb: SelectQueryBuilder<ContentDraft>) {
        super(qb, ContentDraftQuery);
    }

    byUser(userId: UserSk) {
        return new ContentDraftQuery(this.qb.where({ userId }));
    }

    byContent(contentId: ContentSk) {
        return new ContentDraftQuery(this.qb.where({ contentId }));
    }

    selectRaw() {
        return new ContentDraftQuery(this.qb.addSelect("x.data"));
    }

    selectRelated() {
        const query = this.qb
            .andWhere("x.currentEditingId IS NOT NULL")
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format")
            .leftJoinAndSelect("x.materialDrafts", "materialDrafts")
            .addSelect("x.data");;
        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContentDraft(x, f));
    }

    private selectFocused() {
        const query = this.qb
            .andWhere("x.currentEditingId IS NOT NULL")
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format")
            .leftJoinAndSelect("x.materialDrafts", "materialDrafts")
            .addSelect("materialDrafts.data")
            .addSelect("x.data");
        return mapQuery(query, x => (f: FocusedFormat) => {
            const data = x.data;
            if (!data) {
                throw new InternalError("data is null");
            }
            return toFocusedContentDraft(x, f, data);
        });
    }

    async getRelatedMany(rep: ContentRepository, formatRep: FormatRepository) {
        const drafts = await this.selectRelated().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(drafts.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [buildFormat, struct] = await getFormat(x);
            const relations = await formatRep.getRelations(struct.formatId);
            const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const relatedDrafts = drafts.map(x => x.result(structMap[x.raw.structureId].format));

        // Related contents
        await Promise.all(relatedDrafts.map(x => ContentQuery.locateRelatedEntity(rep, x.data, x.format)));

        return relatedDrafts;
    }

    async getFocusedMany(userId: UserSk | null, rep: ContentRepository, formatRep: FormatRepository) {
        const drafts = await this.selectFocused().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(drafts.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [buildFormat, struct] = await getFormat(x);
            const relations = await formatRep.getRelations(struct.formatId);
            const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const relatedDrafts = drafts.map(x => x.result(structMap[x.raw.structureId].format));

        // Related contents
        await Promise.all(relatedDrafts.map(x => ContentQuery.locateRelatedEntity(rep, x.data, x.format)));

        return relatedDrafts;
    }
}

export class ContentDraftQueryFromEntity extends SelectQueryFromEntity<ContentDraft> {
    constructor(draft: ContentDraft) {
        super(draft);
    }

    async getRelated() {
        return (f: FocusedFormat) => toRelatedContentDraft(this.raw, f);
    }
}