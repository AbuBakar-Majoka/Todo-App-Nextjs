import { deleteCookie, getUserSessionId } from "@/lib/auth";
import { connectDb } from "@/lib/connectDB";
import Session from "@/models/sessionModel";

export const POST = async () => {
  try {
    await connectDb();
    const session = await getUserSessionId();

    const [sessionId] = session.value.split(".");

    await Session.findByIdAndDelete(sessionId);
    await deleteCookie(session.name);

    return Response.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
};
