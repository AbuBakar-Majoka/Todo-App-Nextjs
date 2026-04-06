import { connectDb } from "@/lib/connectDB";
import { getLoggenInUser } from "@/lib/auth";

export const GET = async (request) => {
  await connectDb();
  const Cookie = await getLoggenInUser();

  if (!Cookie.success) {
    return Response.json({ error: "Please Login" }, { status: 401 });
  }

  const user = Cookie.user;

  return Response.json(user);
};
