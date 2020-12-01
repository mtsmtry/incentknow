import { Container } from "../../../entities/container/container";
import { FormatSk } from "../../../entities/format/format";
import { SpaceSk } from "../../../entities/space/space";
import { ContainerQuery } from "../../queries/container/container";
import { BaseCommand, BaseRepository, Command, Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class ContainerRepository implements BaseRepository<ContainerCommand> {
    constructor(private containers: Repository<Container>) {
    }

    fromContainers(trx?: Transaction) {
        return new ContainerQuery(this.containers.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContainerCommand(this.containers.createCommand(trx))
    }
}

export class ContainerCommand implements BaseCommand {
    constructor(private containers: Command<Container>) {
    }

    async getOrCreate(spaceId: SpaceSk, formatId: FormatSk) {
        let container = await this.containers.createQueryBuilder("x").where({ spaceId, formatId }).getOne();
        if (!container) {
            container = this.containers.create({
                spaceId,
                formatId
            });
            container = await this.containers.save(container);
        }
        return container;
    }
}