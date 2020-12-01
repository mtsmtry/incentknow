import { ContentSk } from "../../../entities/content/content";
import { Crawler } from "../../../entities/crawler/crawler";
import { SpaceId, SpaceSk } from "../../../entities/space/space";
import { UserSk } from "../../../entities/user/user";
import { BaseCommand, BaseRepository, Command, Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class CrawlerRepository implements BaseRepository<CrawlerCommand> {
    constructor(
        private crawlers: Repository<Crawler>) {
    }

    createCommand(trx: Transaction) {
        return new CrawlerCommand(this.crawlers.createCommand(trx));
    }
}

export class CrawlerCommand implements BaseCommand {
    constructor(private crawlers: Command<Crawler>) {
    }

    createCrawler(userId: UserSk, spaceId: SpaceSk, definitionId: ContentSk, displayName: string) {
        let crawler = this.crawlers.create({
            spaceId,
            definitionId,
            creatorUserId: userId,
            updaterUserId: userId,
            displayName
        });

        crawler = await this.crawlers.save(crawler);
    }
}