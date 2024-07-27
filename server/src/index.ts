import express, { Express } from "express";
import mongoose from "mongoose";
import TaskItemRouter from './routes/todo-items'
import cors from 'cors'

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())

const mongoURI: string =
  "mongodb+srv://paulkim2025:GtYikvUunRjEs7xM@pktodolist.b6g4ybz.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.error("Failed to connect", err));

app.use("/todo-items", TaskItemRouter)

  app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
