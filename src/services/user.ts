import { db } from "../lib/db";
import { Hmac, createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

export const JWT_SECRET = "mysecret";

class UserService {
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha512", salt);
    const hashedPasword = hash.update(password).digest("hex");
    return db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPasword,
        salt,
      },
    });
  }

  private static getUserbyEmail(email: string) {
    return db.user.findUnique({
      where: {
        email,
      },
    });
  }

  private static generateHashedPassword(password: string, salt: string) {
    const hash = createHmac("sha512", salt);
    return hash.update(password).digest("hex");
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserbyEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const salt = user.salt;
    const hashedPassword = this.generateHashedPassword(password, salt);
    if (hashedPassword !== user.password) {
      throw new Error("Invalid password");
    }
    // generate token
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET
    );
    return token;
  }
}

export default UserService;
