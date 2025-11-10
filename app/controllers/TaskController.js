const Task = require("../model/tasksModel")

class TaskController {
    // add task
    async addTask(req, res) {
        try {
            const {
                title,
                description,
                priority,
                dueDate,
                categoryId,
                labels,
                reminders,
                order
            } = req.body;

            const userId = req.user._id;
            // console.log(userId);

            // Validate required fields
            if (!title || !priority || !dueDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, priority, and due date are required'
                });
            }

            // Validate due date is not in the past
            if (new Date(dueDate) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Due date cannot be in the past'
                });
            }

            const task = new Task({
                userId,
                title,
                description,
                priority,
                dueDate,
                categoryId,
                labels,
                reminders,
                order
            });

            await task.save();
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating task',
                error: error.message
            });
        }
    }
    async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            console.log(taskId);
            
            const userId = req.user._id;

            const {
                title,
                description,
                priority,
                dueDate,
                categoryId,
                labels,
                reminders,
                order
            } = req.body;

            // Validate due date if provided
            if (dueDate && new Date(dueDate) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Due date cannot be in the past',
                });
            }
            const getTask = await Task.findById(taskId);
            if (!getTask) {
                return res.status(401).json({ success: false, message: 'Task not found' });
            }


            // Create update object with all fields
            const updateData = {
                title,
                description,
                priority,
                dueDate,
                categoryId,
                labels,
                reminders,
                order
            };

            // Update the task
            const result = await Task.findByIdAndUpdate(
                taskId,
                updateData,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                data: result,
            });
        } catch (error) {
            console.error('Update task error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating task',
                error: error.message,
            });
        }
    }
}
module.exports = new TaskController()