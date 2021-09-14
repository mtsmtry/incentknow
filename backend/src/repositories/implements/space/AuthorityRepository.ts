import { Container } from "../../../entities/container/Container";
import { Content } from "../../../entities/content/Content";
import { Format } from "../../../entities/format/Format";
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
        private formats: Repository<Format>,
        private contents: Repository<Content>,
        private materials: Repository<Material>,
        private containers: Repository<Container>) {
    }

    fromAuths(trx?: Transaction) {
        return new AuthorityQuery(
            this.spaces.createQuery(trx),
            this.members.createQuery(trx),
            this.formats.createQuery(trx),
            this.contents.createQuery(trx),
            this.materials.createQuery(trx),
            this.containers.createQuery(trx))
    }
}