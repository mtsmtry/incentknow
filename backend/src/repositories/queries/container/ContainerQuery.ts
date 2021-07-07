import { SelectQueryBuilder } from "typeorm";
import { Container, ContainerId, ContainerSk } from "../../../entities/container/Container";
import { FormatSk } from "../../../entities/format/Format";
import { SpaceSk } from "../../../entities/space/Space";
import { toFocusedContainer, toRelatedContainer } from "../../../interfaces/container/Container";
import { IntactReactor } from "../../../interfaces/reactor/Reactor";
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
        const query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.format", "format");

        return mapQuery(query, toRelatedContainer);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.format", "format");

        return mapQuery(query, x => (r: IntactReactor | null) => toFocusedContainer(x, r));
    }
}