import jwt from "jsonwebtoken";

export const createJwtToken = (userid: string) => {
  const jwtSecretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "";
  const accessToken = jwt.sign({ id: userid }, jwtSecretKey, {
    expiresIn: "1h",
    subject: userid,
  });
  const refreshToken = jwt.sign({ id: userid }, jwtSecretKey, {
    expiresIn: "7 days",
  });
  return { accessToken, refreshToken };
};
