import { getCollection } from "@/lib/mongodb";
import bcrypt from "bcrypt";

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
    const users = await getCollection("Users");

    const user = await users.findOne({ email: email });

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
    if (user.type === "manager"){
      return Response.json({data: "valid", redirect:"/manager"});
    }
    else{
      return Response.json({data: "valid", redirect:"/dashboard?=" + email})
    }

  } catch (error) {
    console.error("DB error:", error);
    return Response.json(
      { data: "invalid", error: "DB connection failed" },
      { status: 500 }
    );
  } 
}