import { SelectQueryBuilder } from "typeorm";
import { Container, ContainerId, ContainerSk } from "../../../entities/container/Container";
import { FormatSk } from "../../../entities/format/Format";
import { SpaceSk } from "../../../entities/space/Space";
import { toFocusedContainer, toRelatedContainer } from "../../../interfaces/container/Container";
import { joinProperties } from "../format/StructureQuery";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class ContainerQuery extends SelectFromSingleTableQuery<Container, ContainerQuery, ContainerSk, ContainerId, null> {
    constructor(qb: SelectQueryBuilder<Container>) {
        super(qb, ContainerQuery);
    }

    bySpace(spaceId: SpaceSk) {
        return new ContainerQuery(this.qb.where({ spaceId }));
    }

    bySpaceAndFormat(spaceId: SpaceSk, formatId: FormatSk) {
        return new ContainerQuery(this.qb.where({ spaceId, formatId }));
    }

    selectRelated() {
        let query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.format", "format")
            .leftJoinAndSelect("format.space", "space");

        return mapQuery(query, toRelatedContainer);
    }

    selectFocused() {
        let query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.format", "format")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            .leftJoinAndSelect("format.currentStructure", "currentStructure")
            .addSelect("(SELECT COUNT(*) FROM content AS c WHERE c.containerId = x.id)", "contentCount")
            .addSelect("(SELECT c.updatedAt FROM content AS c WHERE c.containerId = x.id ORDER BY c.updatedAt DESC LIMIT 1)", "latestUpdatedAt");
        query = joinProperties("currentStructure", query);
        return mapQuery(query, (x, raw) => toFocusedContainer(x, null, raw));
    }
}