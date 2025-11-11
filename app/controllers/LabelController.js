const Label = require("../model/labelModel");
const Task = require("../model/tasksModel");
const statusCode = require("../helper/statusCode");

class LabelController {
    // Create new label
    async createLabel(req, res) {
        try {
            const userId = req.user._id;
            const { name, color, taskId } = req.body; 

            
            const newLabel = new Label({ userId, name, color });
            const savedLabel = await newLabel.save();

            if (taskId) {
                const task = await Task.findById(taskId);
                if (!task) {
                    return res.status(statusCode.NOT_FOUND).json({
                        success: false,
                        message: "Task not found to add label",
                    });
                }

                // Push label ID 
                task.labels.push(savedLabel._id);
                await task.save();
            }

            return res.status(statusCode.CREATED).json({
                success: true,
                message: taskId
                    ? "Label created and added to task successfully"
                    : "Label created successfully",
                label: savedLabel,
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }

}

module.exports = new LabelController();
