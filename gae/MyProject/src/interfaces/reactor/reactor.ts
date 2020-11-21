import { Reactor, ReactorState } from "../../entities/reactor/reactor";
import { RelatedContainer, toRelatedContainer } from "../container/container";
import { ContentId } from "../content/content";
import { RelatedFormat, toRelatedFormat } from "../format/format";
import { RelatedSpace, toRelatedSpace } from "../space/space";
import { RelatedUser, toRelatedUser } from "../user/user";

export type ReactorId = string;

export interface IntactReactor {
    reactorId: ReactorId;
    container: RelatedContainer;
    state: ReactorState;
    definitionId: ContentId;
    createdAt: number;
    creatorUser: RelatedUser;
}

function toIntactReactor(reactor: Reactor): IntactReactor {
    return {
        reactorId: reactor.entityId,
        container: toRelatedContainer(reactor.container),
        state: reactor.state,
        definitionId: reactor.definition.entityId,
        createdAt: toTimestamp(reactor.createdAt),
        creatorUser: toRelatedUser(reactor.creatorUser)
    }
}