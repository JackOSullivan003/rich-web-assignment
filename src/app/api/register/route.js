import { MongoClient } from "mongodb";

export async function GET(req) {
  console.log("in the api register page");

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const pass = searchParams.get("pass");

  if (!email || !pass) {
    return Response.json({ data: "invalid" });
  }

  const client = new MongoClient(process.env.MONGODB_URL);
  const dbName = "McDonaldsApp";

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection("login");

    // Check if user exists
    const existing = await collection.findOne({ email });
    if (existing) {
      return Response.json({ data: "exists" });
    }

    // Create user
    await collection.insertOne({ email, pass });

    return Response.json({ data: "created" });

  } catch (error) {
    console.error("DB error:", error);
    return Response.json({ data: "invalid" }, { status: 500 });
  } finally {
    client.close();
  }
}
