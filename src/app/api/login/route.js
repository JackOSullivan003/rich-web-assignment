import { MongoClient } from "mongodb";

export async function GET(req, res) {


  // Make a note we are on
  // the api. This goes to the console.

  console.log("in the api page")

  // get the values
  // that were sent across to us.

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const pass = searchParams.get('pass')

  console.log(email);
  console.log(pass);

  // database call goes here
  const client = new MongoClient(process.env.MONGODB_URL);   
  const dbName = 'McDonaldsApp'; // database name
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("login");

    const user = await collection.findOne({ email: email });

    if (!user) {
      console.log("No user found");
      return Response.json({ data: "invalid" });
    }

    if (user.pass !== pass) {
      console.log("Wrong password");
      return Response.json({ data: "invalid" });
    }

    console.log("Login is valid!");
    router.push("/dashboard");   // redirect
    return;

  } catch (error) {
    console.error("DB error:", error);
    return Response.json(
      { data: "invalid", error: "DB connection failed" },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}

