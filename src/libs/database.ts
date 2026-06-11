import { MongoClient } from "mongodb";

const url =
  process.env.APP_ENV === "test"
    ? process.env.MONGO_TEST_URL
    : process.env.MONGO_URL;
let connectDB: Promise<MongoClient>;

if (!url) throw new Error("할당된 DB 주소가 없습니다.");

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongo) {
    globalThis._mongo = new MongoClient(url).connect();
  }
  connectDB = globalThis._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}

export { connectDB };
