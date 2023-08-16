const express = require('express');
const userContoller = require("../controllers/userContoller");
const isAuthenticated = require("../../src/middleware/isAuthenticated");


const options = {
    "case-sensitive": false,
    "strict": false
}
const router = express.Router(options)

router.post("/register", userContoller.register)

router.post("/login", userContoller.login)

router.get("/profile", isAuthenticated, userContoller.getUser)

router.put("/profile", isAuthenticated, userContoller.updateUser)

module.exports = router;