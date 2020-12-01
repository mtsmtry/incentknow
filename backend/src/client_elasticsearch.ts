import * as es from '@elastic/elasticsearch';
import { ContainerId } from './utils_entities';

class ElasticsearchClient {
    constructor(private es: es.Client) {

    }

    async upsert(containerId: string, body: any) {
        await this.es.index({
            index: containerId,
            body
        });
    }
}