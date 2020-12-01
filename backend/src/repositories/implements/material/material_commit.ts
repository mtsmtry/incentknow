import { } from "typeorm";
import { MaterialSk } from "../../../entities/material/material";
import { MaterialCommit, MaterialCommitSk } from "../../../entities/material/material_commit";
import { MaterialEditingSk } from "../../../entities/material/material_editing";
import { UserSk } from "../../../entities/user/user";
import { MaterialCommitQuery, MaterialCommitQueryFromEntity } from "../../queries/material/material_commit";
import { BaseCommand, BaseRepository, Command, Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class MaterialCommitRepository implements BaseRepository<MaterialCommitCommand> {
    constructor(private commits: Repository<MaterialCommit>) {
    }

    fromCommits(trx?: Transaction) {
        return new MaterialCommitQuery(this.commits.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new MaterialCommitCommand(this.commits.createCommand(trx));
    }
}

export class MaterialCommitCommand implements BaseCommand {
    constructor(
        private commits: Command<MaterialCommit>) {
    }

    async commitMaterial(userId: UserSk, materialId: MaterialSk, data: string, basedCommitId: MaterialCommitSk | null, editingId: MaterialEditingSk) {
        let commit = this.commits.create({
            materialId,
            editingId,
            basedCommitId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        return new MaterialCommitQueryFromEntity(commit);
    }
}