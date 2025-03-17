require("dotenv").config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000',  
  }));
  
  //mongodb://127.0.0.1:27017/mern-app



mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ DB Connected!"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type: String
    },
    description: String
})



const todoModel = mongoose.model('Todo', todoSchema);
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
      const newTodo = new todoModel({ title, description });
      await newTodo.save();
      res.status(201).json(newTodo);
    }
    catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });


app.get('/todos', async (req, res) => {
    try {
        
        const todos = await todoModel.find().lean();
        console.log("Todos:", todos);  
        res.json(todos);  
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});




app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }  
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("Backend is running!");
});


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});











