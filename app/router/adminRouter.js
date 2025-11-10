const express = require('express')
const AdminController = require('../controllers/AdminController')
const AdminAuthCheck=require("../middleware/AdminAuthCheck")
const router = express.Router()

router.get('/logout', AdminController.logoutAdmin);
module.exports = router
