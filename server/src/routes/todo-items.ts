import express, { Request, Response } from "express";
import TaskItemModel from "../schema/todo-item";

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await TaskItemModel.find({ userId: userId });
    res.status(200).send(records);
  } catch (error) {
    res.status(500).send(error);
  }
});

// route for addTask
router.post("/", async (req: Request, res: Response) => {
  try {
    const newTaskBody = req.body;
    const newTask = new TaskItemModel(newTaskBody);
    const savedTask = await newTask.save();
    res.status(200).send(savedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

// route for updateTask
router.put("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const newTaskBody = req.body;
      const task = await TaskItemModel.findByIdAndUpdate(
        id,
        newTaskBody,
        { new: true }
      );
  
      if (!task) return res.status(404).send();
  
      res.status(200).send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// route for deleteTask
router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const task = await TaskItemModel.findByIdAndDelete(id)
  
      if (!task) return res.status(404).send();
  
      res.status(200).send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  });


export default router;
