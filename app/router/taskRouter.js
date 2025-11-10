const express = require('express')
const UserAuthCheck=require("../middleware/UserAuthCheck")
const AuthCheck = require('../middleware/AuthCheck')
const TaskController = require('../controllers/TaskController')
const router = express.Router()

router.post("/create",UserAuthCheck,TaskController.addTask)
router.post("/edit/:taskId",UserAuthCheck,TaskController.updateTask)
module.exports = router