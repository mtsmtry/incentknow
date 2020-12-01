import { SelectQueryBuilder } from "typeorm";
import { Container, ContainerId, ContainerSk } from "../../../entities/container/container";
import { FormatSk } from "../../../entities/format/format";
import { SpaceSk } from "../../../entities/space/space";
import { toFocusedContainer, toRelatedContainer } from "../../../interfaces/container/container";
import { IntactReactor } from "../../../interfaces/reactor/reactor";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class ContainerQuery extends SelectFromSingleTableQuery<Container, ContainerQuery, ContainerSk, ContainerId, null> {
    constructor(qb: SelectQueryBuilder<Container>) {
        super(qb, ContainerQuery);
    }

    bySpaceAndFormat(spaceId: SpaceSk, formatId: FormatSk) {
        return new ContainerQuery(this.qb.where({ spaceId, formatId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("format", "format");

        return mapQuery(query, toRelatedContainer);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("format", "format");

        return mapQuery(query, x => (r: IntactReactor | null) => toFocusedContainer(x, r));
    }
}