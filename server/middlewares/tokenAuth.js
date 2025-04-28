const jwt = require("jsonwebtoken");

//Only Checking for expiry of token
const secretKey = process.env.SECRET_KEY;
const getUserAuthentication = (req, res, next) => {
    try {
        // console.log(req.cookies)
        const token = req.cookies.access_token;
        if (!token) return res.status(404).send("User not found")
        req.isAdmin = jwt.decode(token).isAdmin
        // console.log("DECODED JWT", isAdmin)
        // console.log(isAdmin.isAdmin)
        jwt.verify(token, secretKey)
        next()
    } catch (error) {
        console.log(error)
        res.status(404).json({message: "Token Expired or Invalid", error})
    }
}

module.exports = getUserAuthentication;