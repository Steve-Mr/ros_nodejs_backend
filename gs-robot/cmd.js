const express = require('express')
const app = express();

app.use('/cmd', require('./cmd/add_position'));
app.use('/cmd', require('./cmd/delete_position'))

module.exports = app