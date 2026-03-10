import { redirect } from "react-router-dom";

export const guestLoader = async () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return redirect("/dashboard");
  }
  return null;
};
