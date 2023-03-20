import { model, Schema } from "mongoose";
import { IUser } from "../types/user.type";
import bcrypt from "bcryptjs";

export const ROLES = ["ROLE_ADMIN", "ROLE_USER"];

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    roles: {
      type: [
        {
          type: String,
          enum: ROLES,
        },
      ],
      validate: (v: string[]) => Array.isArray(v) && v.length > 0,
    },
  },
  {
    timestamps: true,
    collation: { locale: "fr", strength: 2 },
  }
);

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error: any) {
    throw new Error(error);
  }
};

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
