import axios from "axios";

const API_BASE_URL = "https://todo-app-backend-5507.onrender.com";

// const API_BASE_URL = 'http://127.0.0.1:5000';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,
});

// Fetch all tasks
export const getTasks = async () => {
    return await api.get("/tasks");
};

// Add a new task
export const addTask = async (title) => {
    return await api.post("/tasks/", { title, completed: false });
};

// Delete a task
export const deleteTask = async (id) => {
    return await api.delete(`/tasks/${id}`);
};

// Update task (toggle completion or edit title)
export const updateTask = async (id, updatedData) => {
    return await api.put(`/tasks/${id}`, updatedData);
};

// Toggle task completion
export const toggleTaskCompletion = async (id, completed) => {
    return await api.put(`/tasks/${id}`, { completed: !completed });
};
