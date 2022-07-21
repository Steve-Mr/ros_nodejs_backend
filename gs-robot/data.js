const express = require('express')
const router = express.Router()

router.use('/data', require('./data/map_png'));
router.use('/data', require('./data/maps'));
module.exports = router
 

