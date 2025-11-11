const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: '#28a745' 
    }
}, { timestamps: true });

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;
