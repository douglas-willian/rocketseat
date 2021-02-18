const express = require('express')
const authMiddleware = require('../middlewares/auth.js')
const router = express.Router()
const Project = require('../models/project.js')
const Task = require('../models/task.js')

router.use(authMiddleware)

router.get('/', async function (req, res) {
    try {
        const projects = await Project.find().populate(['tasks', 'user'])
        return res.send({ projects })
    } catch (err) {
        return res.status(400).send({ Erro: 'Erro carregando projetos' })
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['tasks', 'user'])
        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ Erro: 'Erro carregando projeto' })
    }
})

router.post('/', async function (req, res) {
    try {
        const { title, description, tasks } = req.body
console.log({projetcontroller: this.password})
        const newProject = await Project.create({ title, description, user: req.userId })

        await Promise.all(tasks.map(async function (task) {
            const projectTask = new Task({ ...task, project: project._id })
            projectTask.save()

            project.tasks.push(task)
        }))
        await project.save()

        return res.send({ newProject })
    } catch (err) {
        console.log(err)
        return res.status(400).send(err.message)
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body
        const newProject = await Project.findByIdAndUpdate(req.params.projectId,
            { title, description }, { new: true })

        project.tasks = []
        await Task.remove({ project: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            projectTask.save()
            project.tasks.push(task)
        }))
        await project.save()

        return res.send({ newProject })
    } catch (err) {
        return res.status(400).send(err.message)
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId)
        return res.status(204)
    } catch (err) {
        return res.status(400).send({ Erro: 'Erro deletando projeto' })
    }
})

module.exports = app => app.use('/projects', router)