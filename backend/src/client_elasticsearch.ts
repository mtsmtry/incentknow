import * as es from '@elastic/elasticsearch';

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