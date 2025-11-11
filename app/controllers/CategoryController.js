const Category = require("../model/categoryModel");
const statusCode = require("../helper/statusCode");

class CategoryController {
    // Create Category
    async createCategory(req, res) {
        try {
            const userId = req.user._id; // safer: from token instead of body
            const { name, description } = req.body;

            if (!name) {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Category name is required"
                });
            }

            const existingCategory = await Category.findOne({ userId, name });
            if (existingCategory) {
                return res.status(statusCode.CONFLICT).json({
                    success: false,
                    message: "Category with this name already exists"
                });
            }

            const category = await Category.create({ userId, name, description });

            return res.status(statusCode.CREATED).json({
                success: true,
                message: "Category created successfully",
                category
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update Category
    async updateCategory(req, res) {
        try {
            const id = req.params.id;
            const { name, description } = req.body;
            const userId = req.user._id;

            const category = await Category.findOne({ _id: id, userId });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "Category not found"
                });
            }

            category.name = name || category.name;
            category.description = description || category.description;
            await category.save();

            return res.status(statusCode.OK).json({
                success: true,
                message: "Category updated successfully",
                category
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete Category
    async deleteCategory(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user._id;

            const category = await Category.findOneAndDelete({ _id: id, userId });
            if (!category) {
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "Category not found"
                });
            }

            return res.status(statusCode.OK).json({
                success: true,
                message: "Category deleted successfully"
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // List Categories (for a user)
    async listCategories(req, res) {
        try {
            const userId = req.user._id;
            const categories = await Category.find({ userId }).sort({ createdAt: -1 });

            return res.status(statusCode.OK).json({
                success: true,
                categories
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
