const mongoose = require('../../database')
const bcrypt = require('bcrypt')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

    TaskSchema.pre('save', async function (next) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    })

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;