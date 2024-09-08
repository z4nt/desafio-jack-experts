const express = require('express')
const app = express()
const sequelize = require('./config/database.js')
const sync = require('./config/sync.js')
const bodyParser = require('body-parser');
const RouterTarefa = require('./routes/tarefaRoutes.js')
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json());
app.use('/task', RouterTarefa)       


app.listen(10000, () => {
    console.log('http://localhost:10000')
})