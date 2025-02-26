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
  Skeleton,
  ThemeProvider
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {CssBaseline} from "@mui/material";
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
} from "./api";
import theme from "./theme";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="sm" style={{ marginTop: "40px" }}>
      <Typography variant="h4" sx={{my:1}}>To-Do List</Typography>
      <Typography variant="p" sx={{my:2}}>Kindly wait for tasks to load from Backend.</Typography>

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
        {loading
          ? [...Array(5)].map((_, index) => (
              <ListItem key={index} divider>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={30} sx={{ ml: 2 }} />
                <Skeleton variant="circular" width={24} height={24} sx={{ ml: "auto" }} />
                <Skeleton variant="circular" width={24} height={24} sx={{ ml: 1 }} />
              </ListItem>
            ))
        
        :tasks.map((task) => (
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
              onClick={() => (editingTask === task.id ? handleUpdateTask(task.id) : startEditing(task))}
            >
              <Edit />
            </IconButton>

            <IconButton onClick={() => handleDeleteTask(task.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
    </ThemeProvider>
  );
};

export default App;
