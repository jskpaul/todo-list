import { useState, useRef } from "react";
import { useTaskItems } from "../../contexts/todo-item-context";
import "./todo-list.css";
import React from "react";

export const TodoList = () => {
  const { tasks, updateTask, deleteTask } = useTaskItems();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] =
    useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  const handleCheckboxChange = async (id: string, completed: boolean) => {
    // Toggle the completed state locally before the update to provide a smoother UI
    const updatedTask = tasks.find((task) => task._id === id);
    if (updatedTask) {
      updatedTask.completed = completed;
      // Call the updateTask function
      if (updatedTask.important) {
        updatedTask.important = 0;
      }
      updateTask(id, updatedTask);
    }
  };

  const handleImportantButton = async (id: string) => {
    const updatedTask = tasks.find((task) => task._id === id);
    if (updatedTask) {
      if (updatedTask.important < 2) {
        updatedTask.important += 1;
      } else {
        updatedTask.important = 0;
      }
      if (updatedTask.completed) {
        updatedTask.completed = false;
      }
      updateTask(id, updatedTask);
    }
  };

  const handleEditClick = (id: string, description: string) => {
    setEditingTaskId(id);
    setEditedTaskDescription(description);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskDescription(e.target.value);
  };

  const handleEditBlur = async (id: string) => {
    // Update the task description when the input field loses focus
    const updatedTask = tasks.find((task) => task._id === id);
    if (editedTaskDescription.trim() !== "") {
      if (updatedTask) {
        updatedTask.description = editedTaskDescription.trim();
        updateTask(id, updatedTask);
      }
    } else {
      deleteTask(id);
    }
    setEditingTaskId(null);
    setEditedTaskDescription("");
  };

  const handleSaveClick = () => {
    setEditingTaskId(null);
    setEditedTaskDescription("");
    if (inputRef.current) {
      inputRef.current.blur(); // Blur the input field
    }
  };

  return (
    <div className="list-container">
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              backgroundColor: task.completed
                ? "green"
                : task.important == 1
                ? "yellow"
                : task.important == 2
                ? "#FF5F1F"
                : "transparent",
            }}
          >
            <div className="task-container" >
              {editingTaskId === task._id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTaskDescription}
                  onChange={handleEditChange}
                  onBlur={() => handleEditBlur(task._id ?? "")}
                />
              ) : (
                <span
                  onClick={() =>
                    handleEditClick(task._id ?? "", task.description)
                  }
                  style={{
                    cursor: "pointer",
                    // backgroundColor: task.important ? "yellow" : "none",
                    color: task.important > 0 ? "black" : "white",
                    textDecoration: task.completed ? "line-through" : "none",
                    backgroundColor:
                      task.important == 1
                        ? "yellow"
                        : task.important == 2
                        ? "#FF5F1F"
                        : "transparent",
                  }}
                  className="task-description"
                >
                  {" "}
                  {task.important == 1
                    ? "!! "
                    : task.important == 2
                    ? "!!! "
                    : ""}
                  {task.description}
                </span>
              )}
            </div>
            <div className="actions-container">
              <button
                className="priority-button"
                style={ 
                  task.important == 1
                    ? { backgroundColor: "yellow", color: "black" }
                    : task.important == 2
                    ? { backgroundColor: "#FF5F1F", color: "black" }
                    : {
                        backgroundColor: "transparent",
                        color: "white",
                        
                      }
                }
                onClick={() => handleImportantButton(task._id ?? "")}
              >
                {task.important == 1
                  ? "VERY IMPORTANT"
                  : task.important == 2
                  ? "URGENT"
                  : "IMPORTANT"}
              </button>
              <label
                htmlFor={`checkbox-${task._id}`}
                className="complete-label"
                style = {{color : task.important == 0 ? "white" : "black"}}
              >
                {task.completed ? "Complete" : "To Do"}
              </label>{" "}
              <input
                id={`checkbox-${task._id}`}
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  handleCheckboxChange(task._id ?? "", e.target.checked)
                }

                // Ensure the value is treated as a boolean
              />
              {editingTaskId === task._id ? (
                <button className="save-button" onClick={handleSaveClick}>
                  {" "}
                  Save{" "}
                </button>
              ) : (
                <button
                  className="button"
                  onClick={() =>
                    handleEditClick(task._id ?? "", task.description)
                  }
                >
                  {" "}
                  Edit{" "}
                </button>
              )}
              <button
                onClick={() => deleteTask(task._id ?? "")}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
