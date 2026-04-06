import { connectDb } from "@/lib/connectDB";
import User from "../../../models/userModel";
import { cookies } from "next/headers";
import crypto from "crypto";
import Session from "@/models/sessionModel";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  await connectDb();
  const cookieStore = await cookies();

  // console.log("request : ", await request.json()); //Agr 2 br request ko await krwayen gy to wo body has already been declared ka error dy ga, q k promise 1 br resolve ho chuka h , ab jb promise e ni rha to hm await q krwayen gy?
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    console.log("User : ", user);

    const hashedPass = await bcrypt.compare(password, user.password);

    if (!user || !hashedPass) {
      return Response.json({ message: "Invalid Credentials" }, { status: 400 });
    }

    const session = await Session.create({ userId: user.id });

    const signature = crypto
      .createHmac("sha256", process.env.COOKIE_SECRET)
      .update(session.id)
      .digest("hex");

    const signedUserSession = `${session.id}.${signature}`;

    cookieStore.set("sid", signedUserSession, {
      httpOnly: true,
      maxAge: 60 * 60,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return Response.json(userObj, { status: 200 });
  } catch (error) {
    console.log("Error : ", error);
  }
};
