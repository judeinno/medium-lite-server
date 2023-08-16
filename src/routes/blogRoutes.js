const express = require('express');
const blogContoller = require("../controllers/blogContoller");
const isAuthenticated = require("../../src/middleware/isAuthenticated");

const options = {
    "case-sensitive": false,
    "strict": false
}
const router = express.Router(options)


router.post("/create", isAuthenticated, blogContoller.uploadHandler, blogContoller.create)
router.get("/get", blogContoller.getAll)
router.get("/get/:blogId", blogContoller.getByID)
router.delete("/delete/:blogId", isAuthenticated, blogContoller.deleteById)
router.put("/update/:blogId", isAuthenticated, blogContoller.uploadHandler, blogContoller.updateById)


module.exports = router;