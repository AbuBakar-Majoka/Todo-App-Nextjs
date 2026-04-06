import { connectDb } from "@/lib/connectDB";
// import { getAllTodos } from "../data";
import Todo from "@/models/todoModel";
import { getLoggenInUser } from "@/lib/auth";
import User from "../../../../models/userModel";

// export const GET = async (request, { params }) => {
//   await connectDb();
//   const { id } = await params;
//   // const snglTodo = await Todo.findOne({ _id: id });
//   const snglTodo = await Todo.findById(id);
//   return Response.json(snglTodo.length === 0 ? "Not available" : snglTodo);
// };

export const PUT = async (request, { params }) => {
  await connectDb();
  const { id } = await params;
  // console.log(id);
  const data = await request.json();
  console.log("data of update todo before userId : ", data);

  try {
    const userCookie = await getLoggenInUser();

    if (!userCookie.success) {
      return Response.json({ error: "Please Login" }, { status: 401 });
    }

    const userId = userCookie.userId;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    data.userId = userId;

    console.log("data of update todo after userId : ", data);

    const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true });
    console.log("Todo Updated", updatedTodo);
  } catch (error) {
    console.log(error);
    return Response.json({ message: "false" });
  }

  return Response.json({ message: "success" });
};

export const DELETE = async (_, { params }) => {
  const { id } = await params;
  console.log(id);
  try {
    const userCookie = await getLoggenInUser();

    if (!userCookie.success) {
      return Response.json({ error: "Please Login" }, { status: 401 });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return Response.json({ message: "Todo Not Found" }, { status: 404 });
    }
    console.log("New Todos : ", deletedTodo);
    return Response.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Failed" });
  }
};
