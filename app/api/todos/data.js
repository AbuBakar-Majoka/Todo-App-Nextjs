import fs from "fs/promises";

export async function getAllTodos() {
  const todosContent = await fs.readFile("todos.json", "utf-8");
  const todosData = JSON.parse(todosContent);
  // console.log("Todos Data in Data.js : ", todosData);
  return todosData;
}
