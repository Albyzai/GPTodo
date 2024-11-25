import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Task", taskSchema);

// export default function CreateTaskModel() {
//   return TaskModel;
// }
