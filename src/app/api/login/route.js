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
        const url = 'mongodb+srv://McDonalds:RonaldMcDonald123@mccluster.aflg6cf.mongodb.net/?appName=McCluster';

        const client = new MongoClient(url);   

        const dbName = 'McDonaldsApp'; // database name

        await client.connect();

        console.log('Connected successfully to server');

        const db = client.db(dbName);

        const collection = db.collection('login'); // collection name

        const findResult = await collection.find({}).toArray();

        console.log('Found documents =>', findResult);


  // at the end of the process we need to send something back.

  return Response.json({ "data":"valid" })

}

