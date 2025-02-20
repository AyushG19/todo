require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors')
const poolUser = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const {logout} = require('./middleWare')

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser())

app.post("/new-access",(req,res)=>{
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.status(403).send("refresh token invalid")
    jwt.verify(refreshToken,process.env.SECRET_REFRESH_TOKEN,(err,decoded)=>{
        if(err) return res.status(403).send("refresh token expired");
        const newToken = jwt.sign({username: decoded.username},process.env.SECRET_ACCESS_TOKEN,{expiresIn:"10s"});
        console.log("sending newtoken")
        return res.status(200).json(newToken);
    })
})
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        const isAvailable = await poolUser.query("SELECT * FROM login_info WHERE username = $1", [username]);
        if (isAvailable.rows.length > 0) return res.status(403).send("Username already taken");

        const hashedPassword = await bcrypt.hash(password, 10);
        await poolUser.query("INSERT INTO login_info(username,password) VALUES($1,$2)", [username, hashedPassword]);
        // console.log(response);
        // console.log(hashedPassword)
        // console.log(await bcrypt.compare(password, hashedPassword))
        return res.status(200).send("successful signup");
    } catch (error) {
        return res.status(500).send("internal server error");
    }
});

//logout
app.post("/logout", logout);

//login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password)

        const response = await poolUser.query("SELECT * FROM login_info WHERE username = $1", [username]);
        if (response.rows.length === 0) return res.status(401).send("user not found");
        const isMatching = await bcrypt.compare(password, response.rows[0].password);
        if (isMatching) {
            console.log("match")
            const accessToken = jwt.sign({ username }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "10s" })
            const refreshToken = jwt.sign({ username }, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "60s" })
            console.log("token:",accessToken,"and",refreshToken)
            return res.cookie("refreshToken", refreshToken, {
                maxAge: 60 * 1000,
                httpOnly:true,
                secure: false, // 🔴 Set to true in production with HTTPS
                sameSite:"lax",
                path: "/",
            }).status(200).json({ accessToken });
            

        }
        else {
            return res.status(403).send("password did not match")
        }
    } catch (error) {
        return res.status(500).send("internal server error");
    }
})

app.listen(4000, () => {
    console.log("listening to 4000")
})
