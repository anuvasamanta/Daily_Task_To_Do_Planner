const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    dueDate: { type: Date, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    order: { type: Number, default: 0 },
    reminders: [
        {
            type: { type: String, enum: ['Notification', 'Repeating'] },
            time: { type: Date },
            repeat: { type: String, enum: ['Daily', 'Weekly'] },
        },
    ],
}, { timestamps: true });


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;