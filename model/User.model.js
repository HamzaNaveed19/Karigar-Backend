import mongoose from "mongoose";

const options = { discriminatorKey: "roleType", timestamps: true };

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    roles: {
      type: [String],
      enum: ["Customer", "ServiceProvider"],
      default: [],
    },
  },
  options
);

const User = mongoose.model("User", UserSchema);
export default User;
