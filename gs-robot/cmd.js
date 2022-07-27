const express = require('express')
const app = express();

app.use('/cmd', require('./cmd/add_position'));
app.use('/cmd', require('./cmd/delete_position'))
app.use('/cmd', require('./cmd/update_virtual_obstacles'))
app.use('/cmd', require('./cmd/position/navigate.js').router)
app.use('/cmd', require('./cmd/pause_navigate'))
app.use('/cmd', require('./cmd/resume_navigate'))
app.use('/cmd', require('./cmd/cancel_navigate'))
app.use('/cmd', require('./cmd/rename_position'))

module.exports = app