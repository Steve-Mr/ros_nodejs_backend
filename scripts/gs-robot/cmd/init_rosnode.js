const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()

const util = require('../util')

router.get('/init_rosnode', (req, res) => {
    rosnodejs.initNode('navigation_node')
    rosnodejs.reset()
    rosnodejs.shutdown()
    rosnodejs.initNode('navigation_node')
    res.json(util.successed_json)
})

module.exports = router