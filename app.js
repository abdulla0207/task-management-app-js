const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const validate = require('validate.js')
const PRIORITIES = require('./helper').priorities

// Port number
const port = 3000

let rawdata = fs.readFileSync('tasks.json')
let data = JSON.parse(rawdata);
//Load View Engine
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))

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

    if (validate.isEmpty(task_form.title) || validate.isEmpty(task_form.description)) {
        res.redirect(`/?answer=no&description=${task_form.description.length}&title=${task_form.title.length}&priority=${task_form.priority}`)
    } else {

        console.log(data)
        let task = {
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

// Creates a server and console logs the port number
app.listen(port, () => { console.log(`Server is running on port ${port}`) })
