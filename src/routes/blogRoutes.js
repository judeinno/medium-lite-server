const express = require('express');
const blogContoller = require("../controllers/blogContoller");
const isAuthenticated = require("../../src/middleware/isAuthenticated");

const options = {
    "case-sensitive": false,
    "strict": false
}
const router = express.Router(options)

router.post("/create", isAuthenticated, blogContoller.create)
router.get("/get", blogContoller.getAll)
router.get("/get/:authorId", isAuthenticated, blogContoller.getByID)
router.delete("/delete/:blogId", isAuthenticated, blogContoller.deleteById)
router.put("/update/:blogId", isAuthenticated, blogContoller.updateById)


module.exports = router;