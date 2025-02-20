require('dotenv').config()
const {verifyToken} = require('./middleWare')
const express = require('express')
const app = express()
const poolTodo = require("./db");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


app.use(cors({
    origin: "http://localhost:5173", // Allow only frontend URL
    credentials: true // Allow cookies and authorization headers
}));
app.use(express.json());
app.use(cookieParser());


//add todoo
app.post("/todo", verifyToken, async (req, res) => {
    try {
        const { description } = req.body;
        const { username } = req.user;
        console.log(description);

        const newTodo = await poolTodo.query("INSERT INTO todo (description,username) VALUES($1,$2) RETURNING *", [description, username]);

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

//get all todo
app.get("/todo", verifyToken, async (req, res) => {
    const { username } = req.user;
    try {
        const list = await poolTodo.query("SELECT * FROM todo WHERE USERNAME = $1 ORDER BY tid ASC ", [username]);

        return res.json(list.rows);
    } catch (error) {
        console.log(error.message);
    }
});

//update todo
app.put("/todo/:id",verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await poolTodo.query("UPDATE todo SET description=$1 WHERE tid=$2", [description, id]);

        return res.json("todo updated");
    } catch (error) {
        console.log(error.message);
    }
});

//delete todo
app.delete("/todo/:id",verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await poolTodo.query("DELETE FROM todo WHERE tid=$1", [id]);

        return res.json("todo deleted");
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(3000, () => {
    console.log("listening to port 3000");
})
