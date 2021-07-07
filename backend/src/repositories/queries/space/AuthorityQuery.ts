import { SelectQueryBuilder } from "typeorm";
import { isNumber } from "util";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { Material, MaterialId, MaterialSk } from "../../../entities/material/Material";
import { Space, SpaceAuth, SpaceId, SpaceSk } from "../../../entities/space/Space";
import { SpaceMember } from "../../../entities/space/SpaceMember";
import { UserSk } from "../../../entities/user/User";
import { InternalError, NotFoundEntity } from "../../../services/Errors";

export class AuthorityQuery {
    constructor(
        private spaces: SelectQueryBuilder<Space>,
        private members: SelectQueryBuilder<SpaceMember>,
        private contents: SelectQueryBuilder<Content>,
        private materials: SelectQueryBuilder<Material>) {
    }

    async getSpaceAuthByEntity(auth: SpaceAuth, userId: UserSk | null, space: Space) {
        const belongSpace = async () => {
            if (!userId) {
                return false;
            }
            const member = await this.members.where({ userId, spaceId: space.id }).getOne();
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

    async getSpaceAuth(auth: SpaceAuth, userId: UserSk | null, spaceId: SpaceSk | SpaceId): Promise<[boolean, Space]> {
        const where = isNumber(spaceId) ? { id: spaceId } : { entityId: spaceId };
        const space = await this.spaces.where(where).getOne();
        if (!space) {
            throw new NotFoundEntity();
        }
        const result = await this.getSpaceAuthByEntity(auth, userId, space);
        return [result, space];
    }

    async getContentAuth(auth: SpaceAuth, userId: UserSk | null, contentId: ContentSk | ContentId): Promise<[boolean, Content]> {
        const where = isNumber(contentId) ? { id: contentId } : { entityId: contentId };
        const content = await this.contents
            .where(where)
            .leftJoinAndSelect("x.container", "container")
            .leftJoinAndSelect("x.container.space", "space")
            .leftJoinAndSelect("x.space", "space")
            .getOne();
        if (!content) {
            throw new NotFoundEntity();
        }
        const result = await this.getSpaceAuthByEntity(auth, userId, content.container.space);
        return [result, content];
    }

    async getMaterialAuth(auth: SpaceAuth, userId: UserSk | null, materialId: MaterialSk | MaterialId): Promise<[boolean, Material]> {
        const where = isNumber(materialId) ? { id: materialId } : { entityId: materialId };
        const material = await this.materials
            .where(where)
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.content.container", "container")
            .leftJoinAndSelect("x.container.space", "space")
            .leftJoinAndSelect("x.space", "space")
            .getOne();
        if (!material) {
            throw new NotFoundEntity();
        }
        let result = false;
        if (material.content?.container.space) {
            result = await this.getSpaceAuthByEntity(auth, userId, material.content?.container.space);
        } else if (material.space) {
            result = await this.getSpaceAuthByEntity(auth, userId, material.space);
        } else {
            throw new InternalError();
        }
        return [result, material];
    }
}