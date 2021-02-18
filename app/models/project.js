const mongoose = require('../../database')
const bcrypt = require('bcrypt')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

console.log({project: this.password})
ProjectSchema.pre('save', async function (next) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    })


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;