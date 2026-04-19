"use server";

export async function registerUSer(prevState, formData) {
  console.log("From test file");
  console.log({ prevState });
  console.log("Form Data : ", formData);
  // console.log("name : ", formData.get("name"));
  // console.log("email : ", formData.get("email"));
  // console.log("password : ", formData.get("password"));

  // return { message: `${formData.get("email")} registered` };
  return { error: `${formData.get("email")} not registered` };
}
