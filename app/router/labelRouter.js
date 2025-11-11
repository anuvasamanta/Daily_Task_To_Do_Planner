const express = require('express')
const LabelController=require("../controllers/LabelController")
const UserAuthCheck=require("../middleware/UserAuthCheck")
const router = express.Router()

router.post("/create",UserAuthCheck,LabelController.createLabel)
module.exports = router