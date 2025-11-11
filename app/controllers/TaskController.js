const Task = require("../model/tasksModel")
const statusCode = require('../helper/statusCode');
class TaskController {
    // create task
    async createTask(req, res) {
        try {
            const { userId, title, description, priority, dueDate, categoryId, labels, status, order, reminders } = req.body;
            const newTaskCreate = new Task({ userId, title, description, priority, dueDate, categoryId, labels, status, order, reminders });
            const allTask = await newTaskCreate.save();
            return res.status(statusCode.CREATED).json({
                success: true,
                message: "User Task created successful",
                task: allTask
            })
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    // edit task
    async editTask(req, res) {
        try {
            const id = req.params.id;
            const { userId, title, description, priority, dueDate, categoryId, labels, status, order, reminders } = req.body;
            const updateTask = { userId, title, description, priority, dueDate, categoryId, labels, status, order, reminders };
            const getTask = await Task.findById(id);
            if (!getTask) {
                return res.status(statusCode.NOT_FOUND).json({ success: false, message: 'Task not found' });
            }
            const Data = await Task.findByIdAndUpdate(id, updateTask, { new: true });
            if (!Data) {
                return res.status(statusCode.NOT_FOUND).json({ success: false, message: 'Data not found' });
            }

            return res.status(statusCode.OK).json({ success: true, message: 'Task updated successsfully!', data: Data });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    // delete task
    async deleteTask(req, res) {
        try {
            const id = req.params.id;

            // First find the task to return it later
            const taskData = await Task.findById(id);

            if (!taskData) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
                });
            }

            // Then delete the task
            const deletedTask = await Task.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: "Task deleted successfully",
                data: taskData,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Mark task as completed
    async markAsCompleted(req, res) {
        try {
            const id = req.params.id;

            const task = await Task.findById(id);
            if (!task) {
                return res.status(statusCode.NOT_FOUND).json({
                    success: false,
                    message: "Task not found"
                });
            }

            if (task.status === "Completed") {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Task is already completed"
                });
            }

            task.status = "Completed";
            await task.save();

            return res.status(statusCode.OK).json({
                success: true,
                message: "Task marked as completed",
                task
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // List tasks with optional filters
    async listTasks(req, res) {
        try {
            const userId = req.user._id;
            const { status, categoryId, labelId, fromDate, toDate } = req.query;

            let filters = { userId };

            if (status) filters.status = status;
            if (categoryId) filters.categoryId = categoryId;
            if (labelId) filters.labels = labelId;
            if (fromDate && toDate) {
                filters.dueDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
            }

            const tasks = await Task.find(filters)
                .populate("categoryId", "name color")
                .populate("labels", "name color")
                .sort({ order: 1, dueDate: 1 });

            return res.status(statusCode.OK).json({
                success: true,
                message: "Tasks fetched successfully",
                count: tasks.length,
                tasks
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // Reorder tasks
    async reorderTasks(req, res) {
        try {
            const { tasks } = req.body;

            if (!Array.isArray(tasks)) {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid tasks format"
                });
            }

            const bulkOps = tasks.map(task => ({
                updateOne: {
                    filter: { _id: task._id },
                    update: { order: task.order }
                }
            }));

            await Task.bulkWrite(bulkOps);

            return res.status(statusCode.OK).json({
                success: true,
                message: "Tasks reordered successfully"
            });
        } catch (error) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    // reminder
    async setReminder(req, res) {
        // console.log(req.body);

        try {
            const taskId = req.params.taskId;
            console.log(taskId);


            const { type, time, repeat } = req.body;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
                });
            }
            // Create 
            const newReminder = { type, time, repeat };

            // Push 
            task.reminders.push(newReminder);
            await task.save();

            return res.status(200).json({
                success: true,
                message: "Reminder set successfully",
                reminders: task.reminders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


    // Edit a specific reminder
    async editReminder(req, res) {
        try {
            const { taskId, reminderId } = req.params;
            const { type, time, repeat } = req.body;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
                });
            }

            // Find the reminder by its _id
            const reminder = task.reminders.id(reminderId);
            if (!reminder) {
                return res.status(404).json({
                    success: false,
                    message: "Reminder not found",
                });
            }

            // Update fields if provided
            if (type) reminder.type = type;
            if (time) reminder.time = new Date(time);
            if (repeat) reminder.repeat = repeat;

            await task.save();

            return res.status(200).json({
                success: true,
                message: "Reminder updated successfully",
                reminders: task.reminders,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Delete a specific reminder
    async deleteReminder(req, res) {
        try {
            const taskId = req.params.taskId;
            const reminderId = req.params.reminderId;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found",
                });
            }

            const reminderIndex = task.reminders.findIndex((reminder) => reminder._id.toString() === reminderId);
            if (reminderIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Reminder not found",
                });
            }

            task.reminders.splice(reminderIndex, 1);
            await task.save();

            return res.status(200).json({
                success: true,
                message: "Reminder deleted successfully",
                reminders: task.reminders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }





}
module.exports = new TaskController()