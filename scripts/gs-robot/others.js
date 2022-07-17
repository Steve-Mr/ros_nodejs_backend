const express = require('express')
const router = express.Router()

router.use('/others', require('./others/task_confirm'));

 module.exports = router
 

