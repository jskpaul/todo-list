import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useTaskItems } from "../../contexts/todo-item-context";
import { TodoList } from "./todo-list";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import AlertTitle from '@mui/material/AlertTitle';

export const TodoDashboard = () => {
  const [description, setDescription] = useState("");
  const { tasks, addTask } = useTaskItems();
  const { user } = useUser();
  const [successMessage, setSuccessMessage] = useState("");

  // deleteTask, CompleteTask, addTask
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTask = {
      userId: user?.id ?? "",
      date: new Date(),
      description: description,
      completed: false,
      important: 0,
      order: tasks.length,
    };
    addTask(newTask);
    setDescription("");
    setSuccessMessage("Successfully added task!");
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {successMessage && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          variant="filled"
          severity="success"
          onClose={() => {
            setSuccessMessage("");
          }}
          sx={{ zIndex: 9999, width: '100%', maxWidth: 400 }} // Adjust the value as needed
        > <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}
      <h1>{user?.firstName}'s Todo List</h1>
      <div className="addTask">
        <form onSubmit={handleSubmit}>
          <input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="enter new task"
          />
          <button type="submit" className="button">
            {" "}
            Add Task
          </button>
        </form>
      </div>
      <TodoList />
    </div>
  );
};
