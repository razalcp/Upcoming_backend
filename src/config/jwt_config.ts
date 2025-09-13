import jwt, { Secret, SignOptions } from "jsonwebtoken";

const accessTokenTime =
  process.env.Access_Token_Expirey_Time || "15m";

const refreshTokenTime =
  process.env.Refresh_Token_Expirey_Time || "7d";

const createToken = (user_id: string, role: string): string => {
  const secret_key: Secret = process.env.jwt_secret as string;

  const tok = jwt.sign(
    { user_id, role },
    secret_key,
    { expiresIn: accessTokenTime as SignOptions["expiresIn"] }
  );
  return tok;
};

const createRefreshToken = (user_id: string, role: string): string => {
  const secret_key: Secret = process.env.jwt_secret as string;
  return jwt.sign(
    { user_id, role },
    secret_key,
    { expiresIn: refreshTokenTime as SignOptions["expiresIn"] }
  );
};

export { createToken, createRefreshToken };
