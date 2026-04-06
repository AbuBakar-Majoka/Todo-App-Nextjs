import { connectDb } from "@/lib/connectDB";
// import fs from "fs/promises";
import Todo from "../../../models/todoModel";
import User from "../../../models/userModel";
import { cookies } from "next/headers";
import { getLoggenInUser } from "@/lib/auth";

export const GET = async (request) => {
  await connectDb();
  // const cookieStore = await cookies();
  // const userCookie = cookieStore.get("userId");
  const userCookie = await getLoggenInUser();

  // console.log("userCookie : ", userCookie);

  if (!userCookie.success) {
    return Response.json({ error: "Please Login" }, { status: 401 });
  }

  const userId = userCookie.userId;

  // console.log("signedUser : ", signedUser);

  const user = await User.findById({ _id: userId });

  if (!user) {
    // return Response.json({ error: "Please Login" }, { status: 401 });
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const allTodos = await Todo.find({ userId });
  // console.log(
  //   "Todos : ",
  //   allTodos.map(({ id, _id, text, completed }) => {
  //     // console.log(id);
  //     // console.log(_id);
  //     console.log(_id === id);
  //   })
  // );

  // const response = new Response(JSON.stringify(allTodos), {
  //   headers: {
  //     "Set-Cookie": "name=Majoka,userId=1234;path=/;httpOnly",
  //   },
  // });
  // return response;

  // console.log("headers : ", request.headers.get("cookie"));

  // cookieStore.set("userId", 1234, { httpOnly: true });
  // cookieStore.set("name", "Majoka");
  // cookieStore.set("isAdult", true, { httpOnly: true });
  // cookieStore.set("userId", 1234, { httpOnly: true, maxAge: 5 });
  // console.log("getAll : ", cookieStore.getAll());
  // console.log("name : ", cookieStore.get("name"));
  // console.log("userId : ", cookieStore.get("userId"));
  // console.log("userId : ", cookieStore.has("userId"));

  // cookieStore.delete("userId")
  // console.log("userId : ", cookieStore.get("userId"));
  // console.log("userId : ", cookieStore.has("userId"));

  return Response.json(allTodos);
};

export const POST = async (request) => {
  await connectDb();
  // const cookieStore = await cookies();

  try {
    const newTodo = await request.json();
    // const userId = cookieStore.get("userId").value;
    const userCookie = await getLoggenInUser();

    if (!userCookie.success) {
      return Response.json({ error: "Please Login" }, { status: 401 });
    }

    const userId = userCookie.userId;

    const user = await User.findById({ _id: userId });

    if (!user) {
      // return Response.json({ error: "Please Login" }, { status: 401 });
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    newTodo.userId = userId;

    const addTodo = new Todo(newTodo);
    await addTodo.save();
    return Response.json({ message: "success", data: addTodo });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "false" });
  }
};

// export const PATCH = async (request) => {
//   const updateTodoData = await request.json();

//   try {
//     const fileContent = await fs.readFile("todos.json", "utf-8");
//     const todosData = JSON.parse(fileContent);
//     // console.log(todosData);

//     // const updatedTodos = todosData.map((todo) =>
//     //   todo.id === updateTodoData.id
//     //     ? {
//     //         id: todo.id,
//     //         text: updateTodoData.text ? updateTodoData.text : todo.text,
//     //         completed: updateTodoData.completed
//     //           ? updateTodoData.completed
//     //           : todo.completed,
//     //       }
//     //     : todo
//     // );

//     const updatedTodos = todosData.map((todo) =>
//       todo.id === updateTodoData.id
//         ? {
//             ...todo,
//             ...updateTodoData,
//           }
//         : todo,
//     );

//     console.log(updatedTodos);
//     await fs.writeFile("todos.json", JSON.stringify(updatedTodos, null, 2));
//     console.log("Todo Updated");
//   } catch (error) {
//     console.log(error);
//     return Response.json({ message: "Failed" });
//   }
//   return Response.json({ message: "Success" });
// };
