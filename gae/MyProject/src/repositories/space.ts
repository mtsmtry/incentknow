import { Repository } from "typeorm";
import { Space, SpaceAuth } from "../entities/space/space";
import { SpaceFollow } from "../entities/space/space_follow";
import { MemberType, SpaceMember } from "../entities/space/space_member";
import { User } from "../entities/user/user";
import { SpaceId } from "../interfaces/space/space";
import { SpaceQuery } from "./queries/space/space";
import { SpaceAuthorityQuery } from "./queries/space/space_authority";
import { SpaceMemberQuery } from "./queries/space/space_member";

export class SpaceRepository {
    constructor(
        private spaces: Repository<Space>,
        private members: Repository<SpaceMember>,
        private follows: Repository<SpaceFollow>) {
    }

    fromSpaces() {
        return new SpaceQuery(this.spaces.createQueryBuilder("x"));
    }

    fromMembers() {
        return new SpaceMemberQuery(this.members.createQueryBuilder("x"));
    }

    fromAuths() {
        return new SpaceAuthorityQuery(this.members.createQueryBuilder("x"));
    }

    async createSpace(user: User, displayId: string, displayName: string, description: string) {
        let space = this.spaces.create({
            creatorUser: user,
            displayId: displayId,
            displayName: displayName,
            description: description
        });
        space = await this.spaces.save(space);   
    }

    async addMember(space: Space, user: User, type: MemberType) {
        let member = this.members.create({
            space, user, type
        });
        member = await this.members.save(member);
    }
}