import Database from "$database/Default.ts";
import  User, { IUser } from "$schemas/User.ts";
import * as bcrypt from "bcrypt";
import { create, verify } from "djwt";
import crypto from "node:crypto";


const $inject = [Database];

function AuthenticateUser() {
  return async (username: string, password: string): Promise<string | null> => {
    const user = await User.findOne({ username })

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const jwt = await create({ alg: "HS512", typ: "JWT" }, { userId: user._id.toString() }, key);
    return jwt;
  };
}

export default Object.assign(AuthenticateUser, { $inject });
