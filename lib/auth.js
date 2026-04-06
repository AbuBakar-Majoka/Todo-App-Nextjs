import { cookies } from "next/headers";
import crypto from "crypto";
import Session from "@/models/sessionModel";
import User from "@/models/userModel";

export async function getLoggenInUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("sid");

  if (!session) {
    return { success: false, user: "Not found, please login" };
  }

  const [sessionId, sign] = session.value.split(".");

  const checkSignedUser = checkSignature(sessionId, sign);

  if (!checkSignedUser) {
    return {
      success: false,
      user: "Invalid signature, please login with accurate credentials",
    };
  }

  const DB_session = await Session.findById(sessionId);

  if (!DB_session) {
    return { success: false, user: "Not found, please login" };
  }

  const user = await User.findById(DB_session.userId).select("-password -__v");

  if (!user) {
    return { success: false, user: "Not found, please login" };
  }

  const userSessions = await Session.find({ userId: user.id });

  if (userSessions.length > 1) {
    await Session.deleteOne({ _id: userSessions[0]._id });
  }

  return { success: true, userId: user.id, user };
}

export async function getUserSessionId() {
  const cookieStore = await cookies();
  const session = cookieStore.get("sid");
  if (!session) {
    return { success: false, user: "Not found, please login" };
  }

  const [sessionId, sign] = session.value.split(".");

  const checkSignedUser = checkSignature(sessionId, sign);

  if (!checkSignedUser) {
    return {
      success: false,
      user: "Invalid signature, please login with accurate credentials",
    };
  }

  return session;
}

export function checkSignature(sessionId, signCookie) {
  const signature = crypto
    .createHmac("sha256", process.env.COOKIE_SECRET)
    .update(sessionId)
    .digest("hex");

  if (signature !== signCookie) {
    return false;
  }

  return true;
}

export async function deleteCookie(cookieName) {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
  return true;
}
