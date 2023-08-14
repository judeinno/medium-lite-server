const express = require('express');
const userContoller = require("../controllers/userContoller");

const options = {
    "case-sensitive": false,
    "strict": false
}
const router = express.Router(options)

router.post("/register", userContoller.register)

router.post("/login", userContoller.login)

module.exports = router;