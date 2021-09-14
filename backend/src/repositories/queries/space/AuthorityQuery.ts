import { SelectQueryBuilder } from "typeorm";
import { isNumber } from "util";
import { Container } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { Format, FormatId, FormatSk } from "../../../entities/format/Format";
import { Material, MaterialId, MaterialSk } from "../../../entities/material/Material";
import { Space, SpaceAuthority, SpaceId, SpaceSk } from "../../../entities/space/Space";
import { SpaceMember } from "../../../entities/space/SpaceMember";
import { UserSk } from "../../../entities/user/User";
import { Authority } from "../../../interfaces/content/Content";
import { LackOfAuthority, NotFoundEntity } from "../../../services/Errors";

export function getAuthority(auth: SpaceAuthority) {
    switch (auth) {
        case SpaceAuthority.NONE:
            return Authority.NONE;
        case SpaceAuthority.VISIBLE:
            return Authority.NONE;
        case SpaceAuthority.READABLE:
            return Authority.READABLE;
        case SpaceAuthority.WRITABLE:
            return Authority.WRITABLE;
    }
}

export function checkAuthority(target: Authority, auth: Authority) {
    if (auth == Authority.NONE) {
        return;
    }
    switch (target) {
        case Authority.NONE:
            throw new LackOfAuthority();
            break;
        case Authority.READABLE:
            if (auth == Authority.WRITABLE) {
                throw new LackOfAuthority();
            }
            break;
        case Authority.WRITABLE:
            break;
    }
}

export function checkSpaceAuthority(target: SpaceAuthority, auth: SpaceAuthority) {
    if (auth == SpaceAuthority.NONE) {
        return;
    }
    switch (target) {
        case SpaceAuthority.NONE:
            throw new LackOfAuthority();
            break;
        case SpaceAuthority.VISIBLE:
            if (auth == SpaceAuthority.READABLE || auth == SpaceAuthority.WRITABLE) {
                throw new LackOfAuthority();
            }
            break;
        case SpaceAuthority.READABLE:
            if (auth == SpaceAuthority.WRITABLE) {
                throw new LackOfAuthority();
            }
            break;
        case SpaceAuthority.WRITABLE:
            break;
    }
}

export class AuthorityQuery {
    constructor(
        private spaces: SelectQueryBuilder<Space>,
        private members: SelectQueryBuilder<SpaceMember>,
        private formats: SelectQueryBuilder<Format>,
        private contents: SelectQueryBuilder<Content>,
        private materials: SelectQueryBuilder<Material>,
        private containers: SelectQueryBuilder<Container>) {
    }

    async getReadableContainers(userId: UserSk) {
        const containers = await this.members
            .where({ userId })
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("space.containers", "containers")
            .getMany();
        return containers.map(x => x.space.containers).reduce((p, x) => { p.push(...x); return p });
    }

    async getSpaceAuthority(userId: UserSk | null, spaceId: SpaceSk | SpaceId): Promise<[SpaceAuthority, Space]> {
        const where = isNumber(spaceId) ? { id: spaceId } : { entityId: spaceId };
        const space = await this.spaces.where(where).getOne();
        if (!space) {
            throw new NotFoundEntity();
        }
        if (userId) {
            const member = await this.members.where({ userId, spaceId: space.id }).getOne();
            if (member) {
                return [SpaceAuthority.WRITABLE, space];
            }
        }
        return [space.defaultAuthority, space];
    }

    async getFormatAuthority(userId: UserSk | null, contentId: FormatSk | FormatId): Promise<[Authority, Format]> {
        const where = isNumber(contentId) ? { id: contentId } : { entityId: contentId };
        const format = await this.formats
            .where(where)
            .leftJoinAndSelect("x.space", "space")
            .getOne();
        if (!format) {
            throw new NotFoundEntity();
        }
        if (userId) {
            const member = await this.members.where({ userId, spaceId: format.space.id }).getOne();
            if (member) {
                return [Authority.WRITABLE, format];
            }
        }
        return [getAuthority(format.space.defaultAuthority), format];
    }

    async getContentAuthority(userId: UserSk | null, contentId: ContentSk | ContentId): Promise<[Authority, Content]> {
        const where = isNumber(contentId) ? { id: contentId } : { entityId: contentId };
        const content = await this.contents
            .where(where)
            .leftJoinAndSelect("x.container", "container")
            .leftJoinAndSelect("container.space", "space")
            .getOne();
        if (!content) {
            throw new NotFoundEntity();
        }
        if (userId) {
            const member = await this.members.where({ userId, spaceId: content.container.space.id }).getOne();
            if (member) {
                return [Authority.WRITABLE, content];
            }
        }
        return [getAuthority(content.container.space.defaultAuthority), content];
    }

    async getMaterialAuthority(userId: UserSk | null, materialId: MaterialSk | MaterialId): Promise<[Authority, Material]> {
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
        const space = material.content?.container.space || material.space;
        if (!space) {
            return [Authority.NONE, material];
        }
        if (userId) {
            const member = await this.members.where({ userId, spaceId: space.id }).getOne();
            if (member) {
                return [Authority.WRITABLE, material];
            }
        }
        return [getAuthority(space.defaultAuthority), material];
    }
}