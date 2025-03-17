import { useState, useEffect } from "react";

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null); // Store ID for editing

    // Fetch To-Do items from the backend
    const getItems = async () => {
        try {
            const response = await fetch("/api/todos"); // ✅ Using proxy /api
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    // Add or Update a To-Do
    const handleSubmit = async () => {
        if (!title.trim()) return alert("Title cannot be empty!");

        try {
            if (editId) {
                // ✅ Update To-Do
                await fetch(`/api/todos/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                });
                setEditId(null);
            } else {
                // ✅ Add New To-Do
                await fetch("/api/todos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                });
            }
            getItems(); // Refresh list
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error saving todo:", error);
        }
    };

    // Delete a To-Do
    const deleteItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await fetch(`/api/todos/${id}`, { method: "DELETE" });
            getItems(); // Refresh list
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    // Load To-Dos on Component Mount
    useEffect(() => {
        getItems();
    }, []);

    return (
        <div className="container">
            <h2>To-Do List</h2>
            <div className="form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                />
                <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
            </div>
            <h3>Tasks</h3>
            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        <span className="task-title">{todo.title}</span>
                        <span className="task-desc">{todo.description}</span>
                        <button className="edit" onClick={() => { setTitle(todo.title); setDescription(todo.description); setEditId(todo._id); }}>✏️</button>
                        <button className="delete" onClick={() => deleteItem(todo._id)}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
