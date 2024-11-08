import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private ProjectName = "JewelStock:"
  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: Redis
  ) { }


  async Get(Key: string) {
    if (process.env.REDIS_ENABLE == "false") {
      return [];
    }
    const Keys = await this.redisClient.keys(this.ProjectName + Key);
    if (Keys.length > 0) {
      const ResultData = await this.redisClient.mget(...Keys);
      return ResultData.map((data) => JSON.parse(data));
    }
    else {
      return [];
    }
  }

  async Store(Key: string, DataList: any) {
    if (process.env.REDIS_ENABLE == "false") {
      return;
    }
    for (const Data of DataList) {
      if (Data.Type == "E") {
        return;
      }
      await this.redisClient.set(`${this.ProjectName + Key}:${Data.id}`, JSON.stringify(Data));
    }
  }

  async Remove(Key: string, DataList: any) {
    if (process.env.REDIS_ENABLE == "false") {
      return;
    }
    if (DataList.Type == "E") {
      return;
    }
    await this.redisClient.del(`${this.ProjectName + Key}`);
  }

  async Flush() {
    const Keys = await this.redisClient.keys(this.ProjectName + '*');
    console.log(Keys);
    await this.redisClient.del(Keys);
  }

    async Clear(Key: string) {
      if (process.env.REDIS_ENABLE == "false") {
        return;
      }
      const Keys = await this.redisClient.keys(this.ProjectName + Key + ':*');
      if (Keys.length > 0) {
        await this.redisClient.del(...Keys);
      }
  }
}