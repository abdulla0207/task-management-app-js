const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

// Port number
const port = 3000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port)

