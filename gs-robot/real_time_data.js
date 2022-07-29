const express = require('express')
const router = express.Router()

router.use('/real_time_data', require('./real_time_data/cmd_vel'));

module.exports = router
 

