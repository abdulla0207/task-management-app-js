const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const validate = require('validate.js')
const PRIORITIES = require('./helper').priorities
const uniqueId = require('./helper').uniqueId()

// Port number
const PORT = process.env.PORT || 3000

let rawdata = fs.readFileSync('tasks.json')
let data = JSON.parse(rawdata);
//Load View Engine
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

// Loads the homepage
app.get('/', (req, res) => {
    res.render('index', {
        priorities: PRIORITIES,
        answer: req.query.answer,
        description: req.query.description,
        title: req.query.title,
        priority: req.query.priority
    })
})
// When add button clicked, it saves the information of inputs
// to tasks.json file
app.post('/', (req, res) => {
    let task_form = req.body

    if (validate.isEmpty(task_form.title.trim()) || validate.isEmpty(task_form.description.trim())) {
        res.redirect(`/?answer=no&description=${task_form.description.length}&title=${task_form.title.length}&priority=${task_form.priority}`)
    } else {
        let task = {
            editId: data.length,
            id: uniqueId,
            title: task_form.title,
            description: task_form.description,
            priority: task_form.priority
        }
        data.push(task)
        fs.writeFileSync('tasks.json', JSON.stringify(data))
        res.redirect('/?answer=yes')
    }
})
// Loads the task page
app.get('/tasks', (req, res) => {
    res.render('task', { tasks: data })
})

app.get('/edit/:editId', (req, res) => {
    let editId = req.params.editId
    res.render('edit', { task: data[editId], priorities: PRIORITIES })
})

app.post('/update/:editId', (req, res) => {
    let editId = req.params.editId;

    data[editId]["title"] = req.body.title;
    data[editId]["description"] = req.body.description;
    data[editId]["priority"] = req.body.priority;

    fs.writeFileSync('tasks.json', (JSON.stringify(data)))
    res.redirect('/?updated=true')
})

app.get('/:id/finish', (req, res) => {
    let id = req.params.id
    fs.readFile('tasks.json', (error, data) => {
        if (error) throw error
        let tasks = JSON.parse(data)

        let task = tasks.filter(t => t.id != id)
        fs.writeFile('tasks.json', JSON.stringify(task), (error) => {
            if (error) throw error
            res.render('index', { tasks: task, finish: true, priorities: PRIORITIES })
        })
    })
})
// Creates a server and console logs the port number
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })
