import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, 
{
  timestamps: true, 
});

const User = mongoose.model('User', userSchema);

export default User;

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}