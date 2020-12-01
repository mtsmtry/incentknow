import { SelectQueryBuilder } from "typeorm";
import { Content } from "../../../entities/content/content";
import { Material } from "../../../entities/material/material";
import { Space, SpaceAuth } from "../../../entities/space/space";
import { SpaceMember } from "../../../entities/space/space_member";
import { UserSk } from "../../../entities/user/user";
import { AuthorityQuery } from "../../queries/space/authority";
import { Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class AuthorityRepository {
    constructor(
        private spaces: Repository<Space>,
        private members: Repository<SpaceMember>,
        private contents: Repository<Content>,
        private materials: Repository<Material>) {
    }

    fromAuths(trx?: Transaction) {
        return new AuthorityQuery(
            this.spaces.createQuery(trx),
            this.members.createQuery(trx),
            this.contents.createQuery(trx),
            this.materials.createQuery(trx))
    }
}