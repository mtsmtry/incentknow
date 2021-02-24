import { SelectQueryBuilder } from "typeorm";
import { Content } from "../../../entities/content/Content";
import { Material } from "../../../entities/material/Material";
import { Space, SpaceAuth } from "../../../entities/space/Space";
import { SpaceMember } from "../../../entities/space/SpaceMember";
import { UserSk } from "../../../entities/user/User";
import { AuthorityQuery } from "../../queries/space/AuthorityQuery";
import { Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

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