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

export async function GET(req, res) {
  // Make a note we are on
  // the api. This goes to the console.
  console.log("in the login api")

  // get the values
  // that were sent across to us.
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const pass = searchParams.get('pass')

  console.log(email);
  console.log(pass);

  try {
  // database call goes here
    const client = await connectDB();   
    console.log("Connected successfully to server");
    const dbName = 'McDonaldsApp'; // database name
    
    const db = client.db(dbName);
    const collection = db.collection("login");

    const user = await collection.findOne({ email: email });

    if (!user) {
      console.log("No user found");
      return Response.json({ data: "invalid" });
    }

    const validPass = await bcrypt.compare(pass, user.pass);
    if (!validPass) {
      console.log("Wrong password");
      return Response.json({ data: "invalid" });
    }

    console.log("Login is valid!");
    return Response.json({data: "valid"});

  } catch (error) {
    console.error("DB error:", error);
    return Response.json(
      { data: "invalid", error: "DB connection failed" },
      { status: 500 }
    );
  } 
}