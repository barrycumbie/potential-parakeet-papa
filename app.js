const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello from Cody!!')
})

app.listen(3000)