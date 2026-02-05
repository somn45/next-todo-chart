import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getUserIdByHeaders = async () => {
  const userId = (await headers()).get("x-user-id");

  if (!userId) redirect("/login");
  return userId;
};

export default getUserIdByHeaders;
