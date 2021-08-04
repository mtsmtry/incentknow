import { Content } from "../../../entities/content/Content";
import { Material } from "../../../entities/material/Material";
import { Space } from "../../../entities/space/Space";
import { SpaceMember } from "../../../entities/space/SpaceMember";
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