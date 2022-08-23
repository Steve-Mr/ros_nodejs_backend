const express = require('express')
const app = express();

app.use('/gs-robot', require('./gs-robot/cmd'))

app.listen(8000, function(){
    console.log('server started');
})
