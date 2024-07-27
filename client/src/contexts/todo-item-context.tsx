import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface TaskItem {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  completed: boolean;
  important: number;
  order: number; // to add later, but if I add this maybe i will take away "important" boolean
}

interface TaskItemsContextType {
  tasks: TaskItem[];
  addTask: (task: TaskItem) => void;
  updateTask: (id: string, newTask: TaskItem) => void;
  deleteTask: (id: string) => void;
}

export const TaskItemsContext = createContext<TaskItemsContextType | undefined>(
  undefined
);

export const TaskItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const { user } = useUser();

  const fetchTasks = async () => {
    if (!user) return;

    const response = await fetch(
      `http://localhost:3001/todo-items//getAllByUserID/${user.id}`
    );

    if (response.ok) {
      let tasks = await response.json();
      tasks = tasks.sort((a: TaskItem,b: TaskItem) => (b.important ? 1: 0) - (a.important? 1: 0))
      tasks = tasks.sort((a: TaskItem,b: TaskItem) => (a.completed ? 1: 0) - (b.completed? 1: 0))
      console.log(tasks);
      setTasks(tasks);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (task: TaskItem) => {
    const response = await fetch("http://localhost:3001/todo-items", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
      }
    } catch (error) {}
  };

  const updateTask = async (id: string, newTask: TaskItem) => {
    if (!user) return;

    const response = await fetch(
      `http://localhost:3001/todo-items/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    try {
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => {
            if (task._id === id) {
              return newTask;
            } else {
              return task;
            }
          }).sort((a: TaskItem,b: TaskItem) => (b.important) - (a.important)).sort((a: TaskItem,b: TaskItem) => (a.completed ? 1: 0) - (b.completed? 1: 0))
        );
      }
    } catch (error) {}
  };

  const deleteTask = async (id: string) => {
    const response = await fetch(
      `http://localhost:3001/todo-items/${id}`,
      {
        method: "DELETE",
      }
    );

    try {
      if (response.ok) {
        const deletedTask = await response.json();
        setTasks((prev) =>
          prev.filter((task) => task._id !== deletedTask._id)
        );
      }
    } catch (error) {}
  };

  

  return (
    <TaskItemsContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskItemsContext.Provider>
  );
};

export const useTaskItems = () => {
  const context = useContext <TaskItemsContextType | undefined>(
    TaskItemsContext
  );
  if (!context) {
    throw new Error(
      "useTaskItems must be used within a TaskItemsProvider"
    );
  }

  return context;
};

// export const Task: React.FC<TaskProps> = ({ id, taskName, completed }) => {
//   return (
//     <div
//       className="task"
//       style={{ backgroundColor: completed ? "green" : "white" }}
//     >
//       <h1>{taskName}</h1>
//       <button onClick={() => null}> Complete </button>
//       <button onClick={() => null}> X </button>
//     </div>
//   );
// };
