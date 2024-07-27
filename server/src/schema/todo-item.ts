import mongoose from "mongoose";

interface TaskItem {
  userId: string;
  date: Date;
  description: string;
  completed: boolean;
  important: number;
  order: number;
}

const TaskItemSchema = new mongoose.Schema<TaskItem>({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true },
  important: { type: Number, required: true },
  order: { type: Number, required: true },
});

const TaskItemModel = mongoose.model<TaskItem>("TaskItem", TaskItemSchema);

export default TaskItemModel;
