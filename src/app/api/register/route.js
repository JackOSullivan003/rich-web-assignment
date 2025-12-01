import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";


let cachedClient = null;

async function connectDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  cachedClient = client;
  return client;
}


export async function GET(req) {
  console.log("in the register api");

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const pass = searchParams.get("pass");

  if (!email || !pass) {
    return Response.json({ data: "invalid" });
  }

  const client = new MongoClient(process.env.MONGODB_URL);
  const dbName = "McDonaldsApp";

  try {
    await connectDB();
    const db = client.db(dbName);
    const collection = db.collection("login");

    // Check if user exists
    const existing = await collection.findOne({ email });
    if (existing) {
      return Response.json({ data: "exists" });
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create user
    await collection.insertOne({ email, pass:hashedPassword });

    return Response.json({ data: "created" });

  } catch (error) {
    console.error("DB error:", error);
    return Response.json({ data: "invalid" }, { status: 500 });
  }
}
