import { Query } from "mongoose";
import { createClient } from "redis";

// const redisPort = process.env.REDIS_PORT || 6379;
// const redisHost = process.env.REDIS_HOST;

const client = createClient();
client.connect();

const exec = Query.prototype.exec;

Query.prototype.exec = async function () {
  // 1)Create a  key
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.model.collection.collectionName,
    })
  );
  // 2)Search the value of the key is available inside the redis
  const cacheValue = await client.get(key);

  // 3)If found send it as a mongoose model, which can perform all the mongoose operations
  if (cacheValue) {
    const result = JSON.parse(cacheValue);

    return Array.isArray(result)
      ? result.map((doc) => new this.model(doc))
      : new this.model(result);
  }
  // 4)Otherwise send the request to the mongodb database

  const result = await exec.apply(this, arguments as any);

  client.set(key, JSON.stringify(result));

  return result;
};
