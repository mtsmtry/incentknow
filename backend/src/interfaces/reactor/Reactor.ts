import { ContentId } from "../../entities/content/Content";
import { Reactor, ReactorState } from "../../entities/reactor/Reactor";
import { RelatedContainer, toRelatedContainer } from "../container/Container";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export type ReactorId = string;

export interface IntactReactor {
    reactorId: ReactorId;
    container: RelatedContainer;
    state: ReactorState;
    definitionId: ContentId | null;
    createdAt: number;
    creatorUser: RelatedUser;
}

function toIntactReactor(reactor: Reactor): IntactReactor {
    return {
        reactorId: reactor.entityId,
        container: toRelatedContainer(reactor.container),
        state: reactor.state,
        definitionId: reactor.definition?.entityId || null,
        createdAt: toTimestamp(reactor.createdAt),
        creatorUser: toRelatedUser(reactor.creatorUser)
    }
}