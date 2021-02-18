const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const users = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

require('./app/controllers/index.js')(app);

app.listen(3000, console.log('Escutando porta 3000'))

app.get('/', (req, res) => res.send('ok'))