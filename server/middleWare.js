const jwt = require("jsonwebtoken");

const logout = (req, res) => {
    res.clearCookie("refreshToken", { secure: false, });
    return res.status(401).json({ message: "Logged out. Please log in again." });
};

const verifyToken = (req, res, next) => {
    console.log("Middleware triggered");
    const accessToken = req.headers.authorization?.split(" ")[1];
    console.log("Access Token:", accessToken);

    if (!accessToken) {
        return res.status(403).send("Access token required");
    }
    jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            console.log("error in verification ");
            return res.status(401).send("access token expires");
        }
        console.log(decoded)
        req.user = decoded;
        console.log(req.user,"going next")
        next();
    });

};

module.exports = { verifyToken, logout };
