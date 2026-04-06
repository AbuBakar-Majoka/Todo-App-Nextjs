import { connectDb } from "@/lib/connectDB";
import User from "../../../models/userModel";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  await connectDb();

  // console.log("request : ", await request.json())
  try {
    const userData = await request.json();
    console.log("userData : ", userData);
    const { name, email, password } = userData;
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("hashedPass : ", hashedPass);
    const newUser = new User({ name, email, password : hashedPass });
    await newUser.save();
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.log("Error : ", error);
    if (error.code === 11000) {
      return Response.json(
        { error: "Duplicate email is not allowed" },
        { status: 409 },
      );
    } else {
      return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
};
