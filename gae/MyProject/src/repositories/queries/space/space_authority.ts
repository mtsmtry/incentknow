import { SelectQueryBuilder } from "typeorm";
import { Space, SpaceAuth, SpaceSk } from "../../../entities/space/space";
import { SpaceMember } from "../../../entities/space/space_member";
import { User, UserSk } from "../../../entities/user/user";
import { toIntactSpaceMember } from "../../../interfaces/space/space_member";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class SpaceAuthorityQuery {
    constructor(private members: SelectQueryBuilder<SpaceMember>) {
    }

    async hasSpaceAuth(userId: UserSk | null, space: Space, auth: SpaceAuth) {
        const belongSpace = async () => {
            if (!userId) {
                return false;
            }
            const member = await this.members.where("userId = :userId", { userId }).andWhere("space = :space", { space }).getOne();
            return Boolean(member);
        };

        switch (auth) {
            case SpaceAuth.NONE:
                return true;

            case SpaceAuth.VISIBLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                        return await belongSpace();
                    case SpaceAuth.VISIBLE:
                    case SpaceAuth.READABLE:
                    case SpaceAuth.WRITABLE:
                        return true;
                }

            case SpaceAuth.READABLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                    case SpaceAuth.VISIBLE:
                        return await belongSpace();
                    case SpaceAuth.READABLE:
                    case SpaceAuth.WRITABLE:
                        return true;
                }

            case SpaceAuth.WRITABLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                    case SpaceAuth.VISIBLE:
                    case SpaceAuth.READABLE:
                        return await belongSpace();
                    case SpaceAuth.WRITABLE:
                        return true;
                }
        }
    }

    async checkSpaceAuth(userId: UserSk | null, space: Space, auth: SpaceAuth) {
        if (!await this.hasSpaceAuth(userId, space, auth)) {
            throw "lacked authority";
        }
    }
}