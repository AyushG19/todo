const express = require('express')
const app = express()
const poolTodo = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json());


//add todoo
app.post("/todo", async (req, res) => {
    try {
        const { description } = req.body;
        console.log(description);
        
        const newTodo = await poolTodo.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

//get all todo
app.get("/todo", async (req, res) => {
    try {
        const list = await poolTodo.query("SELECT * FROM todo ORDER BY tid ASC ");

        res.json(list.rows);
    } catch (error) {
        console.log(error.message);
    }
});

//update todo
app.put("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await poolTodo.query("UPDATE todo SET description=$1 WHERE tid=$2", [description, id]);

        res.json("todo updated");
    } catch (error) {
        console.log(error.message);
    }
});

//delete todo
app.delete("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await poolTodo.query("DELETE FROM todo WHERE tid=$1", [id]);

        res.json("todo deleted");
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(3000, () => {
    console.log("listening to port 3000");
})
