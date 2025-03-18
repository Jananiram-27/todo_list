require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Fix: Correct CORS for both local & deployed frontend


app.use(cors({
    origin: ['http://localhost:3000', 'https://todo-list-svsr-jzzizxlhs-jananis-projects-d77344ed.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


// ✅ Fix: Correct MongoDB connection (without warnings)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ DB Connected!"))
    .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ Define Schema & Model
const todoSchema = new mongoose.Schema({
    title: { required: true, type: String },
    description: String
});
const Todo = mongoose.model("Todo", todoSchema);

// ✅ API Route: Home
app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// ✅ API Route: Get All To-Dos
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find().lean();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ API Route: Create a To-Do
app.post("/api/todos", async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ API Route: Update a To-Do
app.put("/api/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );
        if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ API Route: Delete a To-Do
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Start Server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));







