import { MongoClient } from "mongodb";

let cachedClient = null;

export async function clientPromise() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  cachedClient = client;

  return client;
}

// Reusable helper: getCollection("Users"), getCollection("Orders"), etc.
export async function getCollection(name) {
  const client = await clientPromise();
  const db = client.db("McDonaldsApp");
  return db.collection(name);
}