import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentDraft, ContentDraftId, ContentDraftSk } from "../../../entities/content/ContentDraft";
import { isMaterialType, TypeName } from "../../../entities/format/Property";
import { StructureSk } from "../../../entities/format/Structure";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContentDraft, toRelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { mapBy, notNull } from "../../../Utils";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { MaterialEditingRepository } from "../../implements/material/MaterialEditingRepository";
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
            .andWhere("x.state = 'editing'")
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format")
            .addSelect("x.data");;
        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContentDraft(x, f));
    }

    private selectFocused() {
        const query = this.qb
            .andWhere("x.state = 'editing'")
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format")
            .addSelect("x.data");
        return mapQuery(query, x => (f: FocusedFormat) => toFocusedContentDraft(x, f));
    }

    static async locateMaterialDrafts(data: any, format: FocusedFormat, matRep: MaterialEditingRepository, isFocused: boolean) {
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (!value) {
                return;
            }
            if (isMaterialType(prop.type.name)) {
                const matDraft = isFocused
                    ? await matRep.fromDrafts().byEntityId(value).selectFocused().getOne()
                    : await matRep.fromDrafts().byEntityId(value).selectRelated().getOne();
                if (!matDraft) {
                    data[prop.id] = "deleted";
                } else {
                    data[prop.id] = matDraft;
                }
            }
        });
        await Promise.all(promises);
    }

    async getRelatedMany(rep: ContentRepository, formatRep: FormatRepository, matRep: MaterialEditingRepository) {
        const drafts = await this.selectRelated().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(drafts.map(x => x.raw.structureId).filter(notNull)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, struct] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const relatedDrafts = drafts.map(x => x.result(structMap[x.raw.structureId].format));

        // Related contents
        await Promise.all(relatedDrafts.map(async x => {
            await Promise.all([
                ContentQuery.locateContents(rep, x.data, x.format),
                ContentDraftQuery.locateMaterialDrafts(x.data, x.format, matRep, false)
            ]);
        }));

        return relatedDrafts;
    }

    async getFocusedMany(rep: ContentRepository, formatRep: FormatRepository, matRep: MaterialEditingRepository) {
        const drafts = await this.selectFocused().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(drafts.map(x => x.raw.structureId).filter(notNull)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, struct] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedDrafts = drafts.map(x => {
            const format = structMap[x.raw.structureId].format;
            return { draft: x.result(format), format, raw: x.raw }
        });

        // Related contents
        await Promise.all(focusedDrafts.map(async x => {
            await Promise.all([
                ContentQuery.locateContents(rep, x.draft.data, x.format),
                ContentDraftQuery.locateMaterialDrafts(x.draft.data, x.format, matRep, true)
            ]);
        }));

        return focusedDrafts;
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