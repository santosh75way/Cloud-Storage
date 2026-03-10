import { redirect } from "react-router-dom";
import { getProfile } from "./api";

export async function adminLoader() {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    throw redirect("/login");
  }
  
  const profileRes = await getProfile();
  const user = profileRes;

  if (user.role !== "ADMIN") {
    throw redirect("/dashboard");
  }

  return null;
}
