const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (!token) {
            return res.status(404).json({ success: false, msg: "Token not found" });
        }
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, "accessSecret");
        req.email = decoded.email;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: error.message });
    }
}

module.exports = isAuthenticated