const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const PRIORITIES = require('./helper').priorities

// Port number
const port = 3000

let a = "HELLO"
//Load View Engine
app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.route('/').get((req, res) => {
    res.render('index', { priorities: PRIORITIES })
})
app.get('/tasks', (req, res) => {
    res.render('task')
})

app.listen(port, () => { console.log(`Server is running on port ${port}`) })

