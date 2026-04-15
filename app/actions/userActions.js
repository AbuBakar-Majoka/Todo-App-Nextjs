"use server";

export async function registerUSer(formData) {
  console.log("From test file");
  console.log("Form Data : ", formData);
  // console.log("name : ", formData.get("name"));
  // console.log("email : ", formData.get("email"));
  // console.log("password : ", formData.get("password"));

  return { message: "Success" };
}
