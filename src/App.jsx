import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
} from "./api";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await addTask(newTask);
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const handleToggleCompletion = async (id, completed) => {
    try {
      await toggleTaskCompletion(id, completed);
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Start editing task
  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  // Update task
  const handleUpdateTask = async (id) => {
    try {
      await updateTask(id, { title: editedTitle });
      setTasks(tasks.map((task) => (task.id === id ? { ...task, title: editedTitle } : task)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "40px" }}>
      <Typography variant="h4" sx={{my:2, fontStyle: 'bold'}}>To-Do List</Typography>

      <TextField
        label="New Task"
        variant="outlined"
        fullWidth
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddTask}
        style={{ marginTop: "10px" }}
      >
        Add Task
      </Button>

      <List sx={{border: 1, borderColor: 'gray', p:2, my:2}}>
        {tasks.map((task) => (
          <ListItem key={task.id} divider>
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleCompletion(task.id, task.completed)}
            />

            {editingTask === task.id ? (
              <TextField
                fullWidth
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateTask(task.id)}
              />
            ) : (
              <ListItemText
                primary={task.title}
                secondary={`Added: ${new Date(task.date_added).toLocaleString()}`}
                style={{ textDecoration: task.completed ? "line-through" : "none" }}
              />
            )}

            <IconButton
              color="primary"
              onClick={() => (editingTask === task.id ? handleUpdateTask(task.id) : startEditing(task))}
            >
              <Edit />
            </IconButton>

            <IconButton color="secondary" onClick={() => handleDeleteTask(task.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
