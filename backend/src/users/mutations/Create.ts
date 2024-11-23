import User, { IUser } from "$schemas/User.ts";
import { hash } from "bcrypt";

export default function CreateUserMutation() {
  return async (username: string, password: string): Promise<IUser> => {
    const hashedPassword = await hash(password);
    const user = new User({ username, password: hashedPassword });
    console.log("user created", user);
    await user.save();
    return user;
  };
}
