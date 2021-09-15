import { SelectQueryBuilder } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { isMaterialType, PropertyId, TypeName } from "../../../entities/format/Property";
import { StructureSk } from "../../../entities/format/Structure";
import { Material } from "../../../entities/material/Material";
import { SpaceSk } from "../../../entities/space/Space";
import { Authority, toFocusedContent, toRelatedContent } from "../../../interfaces/content/Content";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/Material";
import { mapBy, mapByString } from "../../../Utils";
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
        const query = this.qb.where({ containerId }).andWhere(`commit.data->>'$."${propertyId}"' = :value`, { value });
        return new ContentQuery(query);
    }

    joinStructureAndFormat() {
        return new ContentQuery(this.qb.leftJoinAndSelect("x.structure", "structure").leftJoinAndSelect("structure.format", "format"));
    }

    joinContainer() {
        return new ContentQuery(this.qb.leftJoinAndSelect("x.container", "container"));
    }

    latest() {
        return new ContentQuery(this.qb.orderBy("x.updatedAt", "DESC"));
    }

    mostViewed() {
        return new ContentQuery(this.qb.orderBy("x.viewCount", "DESC"));
    }

    static async locateContents(rep: ContentRepository, data: any, format: FocusedFormat) {
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (value == null) {
                return;
            }
            if (prop.type.name == TypeName.CONTENT && prop.type.format) {
                const [buildContent, raw] = await rep.fromContents().byEntityId(value).selectRelated().getOneWithRaw();
                data[prop.id] = buildContent ? buildContent(prop.type.format, Authority.READABLE) : "deleted";
            }
        });
        await Promise.all(promises);
    }

    static async locateMaterials(data: any, materials: Material[], format: FocusedFormat, isFocused: boolean) {
        const materialDict = mapByString(materials, x => x.entityId);
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (!value) {
                return;
            }
            if (isMaterialType(prop.type.name)) {
                const material = materialDict[value];
                if (!material) {
                    data[prop.id] = "deleted";
                } else {
                    data[prop.id] = isFocused ? toFocusedMaterial(material, null) : toRelatedMaterial(material);
                }
            }
        });
        await Promise.all(promises);
    }

    static joinRelated<a>(qb: SelectQueryBuilder<a>, name: string) {
        return qb
            .leftJoinAndSelect(name + ".creatorUser", "creatorUser")
            .leftJoinAndSelect(name + ".updaterUser", "updaterUser")
            .leftJoinAndSelect(name + ".materials", "materials")
            .leftJoinAndSelect("materials.commit", "materialCommits")
            .leftJoinAndSelect("materials.creatorUser", "materialCreatorUsers")
            .leftJoinAndSelect("materials.updaterUser", "materialUpdaterUsers")
            .leftJoinAndSelect(name + ".commit", "commit")
            .addSelect("commit.data");
    }

    private selectRelated() {
        const query = ContentQuery.joinRelated(this.qb, "x")
            .addSelect("(SELECT COUNT(*) FROM comment AS c WHERE c.contentId = x.id)", "commentCount")
        return mapQuery(query, (x, raw) => (f: FocusedFormat, a: Authority) => toRelatedContent(x, f, a, raw.commentCount));
    }

    private selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.materials", "materials")
            .leftJoinAndSelect("materials.commit", "materialCommits")
            .leftJoinAndSelect("materials.creatorUser", "materialCreatorUsers")
            .leftJoinAndSelect("materials.updaterUser", "materialUpdaterUsers")
            .leftJoinAndSelect("x.commit", "commit")
            .addSelect("(SELECT COUNT(*) FROM comment AS c WHERE c.contentId = x.id)", "commentCount")
            .addSelect("materialCommits.data")
            .addSelect("commit.data");

        return mapQuery(query, (x, raw) => (f: FocusedFormat, a: Authority) => {
            x.materials.forEach(mat => mat.content = x);
            return toFocusedContent(x, f, a, raw.commentCount);
        });
    }

    static async makeRelatedMany(contents: Content[], auth: Authority, rep: ContentRepository, formatRep: FormatRepository) {
        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, struct] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedContents = await Promise.all(contents.map(async content => {
            const format = structMap[content.structureId].format;
            await Promise.all([
                ContentQuery.locateContents(rep, content.commit.data, format),
                ContentQuery.locateMaterials(content.commit.data, content.materials, format, false)
            ]);
            return toRelatedContent(content, format, auth, 0);
        }));

        return focusedContents;
    }

    async getRelatedMany(rep: ContentRepository, formatRep: FormatRepository, auth: Authority) {
        const contents = await this.selectRelated().getManyWithRaw();
        return await ContentQuery.makeRelatedMany(contents.map(x => x.raw), auth, rep, formatRep)
    }

    async getFocusedMany(rep: ContentRepository, formatRep: FormatRepository, auth: Authority) {
        const contents = await this.selectFocused().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, structure] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x, structure };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedContents = await Promise.all(contents.map(async content => {
            const struct = structMap[content.raw.structureId];
            await Promise.all([
                ContentQuery.locateContents(rep, content.raw.commit.data, struct.format),
                ContentQuery.locateMaterials(content.raw.commit.data, content.raw.materials, struct.format, true)
            ]);
            return { 
                content: content.result(struct.format, auth),
                format: struct.format,
                raw: content.raw,
                structure: struct.structure,
                formatRaw: struct.structure.format
            };
        }));

        return focusedContents;
    }

    joinCommitAndData() {
        return new ContentQuery(this.qb.leftJoinAndSelect("x.commit", "commit").addSelect("commit.data"));
    }
}

export class ContentQueryFromEntity extends SelectQueryFromEntity<Content> {
    constructor(content: Content) {
        super(content);
    }
}