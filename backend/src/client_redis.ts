import * as Redis from 'ioredis';

class RedisClient {
    redis: Redis.Redis;
    authUserId: number;

    constructor() {
        this.redis = new Redis(19115, "redis-19115.c1.asia-northeast1-1.gce.cloud.redislabs.com", { password: "0KJo2hhu6oHsRQvK1TgWduXMtXBYqe27" })
    }

    async getFormat(formatId: string) {
        return await this.redis.get("f:" + formatId);
    }

    async setFormat(formatId: string, data: string) {
        return await this.redis.set("f:" + formatId, data, "ex");
    }
}