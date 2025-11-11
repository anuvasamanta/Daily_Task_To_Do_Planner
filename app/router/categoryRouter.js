const express = require('express');
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const UserAuthCheck = require("../middleware/UserAuthCheck");

router.post("/create", UserAuthCheck, CategoryController.createCategory);
router.put("/update/:id", UserAuthCheck, CategoryController.updateCategory);
router.delete("/delete/:id", UserAuthCheck, CategoryController.deleteCategory);
router.get("/list", UserAuthCheck, CategoryController.listCategories);

module.exports = router;
