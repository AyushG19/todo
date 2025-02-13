const express = require('express');
const app = express();
const cors = require('cors')
const poolUser = require('./db')
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(cors())

app.post("/signup", async (req, res) => {
    try {
        const { username, password, recheckPassword } = req.body;
        const isAvailable = await poolUser.query("SELECT * FROM login_info WHERE username = $1", [username]);
        if (isAvailable.rows.length > 0) return res.status(403).send("Username already taken");

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await poolUser.query("INSERT INTO login_info(username,password) VALUES($1,$2)", [username, hashedPassword]);
        console.log(response);
        console.log(hashedPassword)
        console.log(await bcrypt.compare(password, hashedPassword))
        return res.status(201).send("sucessfully signed up")

    } catch (error) {
        console.log(error)
    }
})

//login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username,password)

        const response = await poolUser.query("SELECT * FROM login_info WHERE username = $1", [username]);
        if (response.rows.length === 0) return res.status(403).send("user not found");

        const isMatching = await bcrypt.compare(password,response.rows[0].password);
        console.log(isMatching,password,response.rows[0].password);
        if (isMatching) {
            console.log("match")
            return res.status(200).send("login sucessful");
        }
        else {
            return res.status(403).send("password did not match")
        }

    } catch (error) {
        console.log(error);
    }
})

app.listen(4000, () => {
    console.log("listening to 4000")
})