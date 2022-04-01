const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const validate = require('validate.js')
const PRIORITIES = require('./helper').priorities

// Port number
const port = 3000

let a = "HELLO"
//Load View Engine
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))

// Loads the homepage
app.get('/', (req, res) => {
    if (req.query.received == 'yes') {
        res.render('index', { priorities: PRIORITIES, answer: req.query.received })
    } else {
        res.render('index', { priorities: PRIORITIES })
    }
})
// When add button clicked, it saves the information of inputs
// to tasks.json file
app.post('/', (req, res) => {
    let task_form = req.body

    if (validate.isEmpty(task_form.title) || validate.isEmpty(task_form.description)) {
        res.redirect('/?received=no')
    } else {
        let rawdata = fs.readFileSync('tasks.json')
        let data = JSON.parse(rawdata);

        let task = {
            title: task_form.title,
            description: task_form.description,
            priority: task_form.priority
        }
        data.push(task)
        fs.writeFileSync('tasks.json', JSON.stringify(data))
        res.redirect(`/?received=yes&priority=${task_form.priority}`)
    }
})
// Loads the task page
app.get('/tasks', (req, res) => {
    res.render('task')
})

// Creates a server and console logs the port number
app.listen(port, () => { console.log(`Server is running on port ${port}`) })

