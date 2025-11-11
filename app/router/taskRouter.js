const express = require('express')
const UserAuthCheck=require("../middleware/UserAuthCheck")
const AuthCheck = require('../middleware/AuthCheck')
const TaskController = require('../controllers/TaskController')
const router = express.Router()

router.post("/create",UserAuthCheck,TaskController.createTask)
router.post("/edit/:id",UserAuthCheck,TaskController.editTask)
router.get("/delete/:id",UserAuthCheck,TaskController.deleteTask)
router.patch("/complete/:id", UserAuthCheck, TaskController.markAsCompleted);
router.get("/list", UserAuthCheck, TaskController.listTasks);
router.post("/reorder", UserAuthCheck, TaskController.reorderTasks);
router.post("/reminder/:taskId",UserAuthCheck,TaskController.setReminder)
router.put("/reminder/:taskId/:reminderId", UserAuthCheck, TaskController.editReminder);
router.delete("/reminder/delete/:taskId/:reminderId",UserAuthCheck,TaskController.deleteReminder)
module.exports = router