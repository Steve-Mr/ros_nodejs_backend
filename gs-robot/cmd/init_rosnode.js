const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()

const util = require('../util')

router.get('/init_rosnode', (req, res) => {
    rosnodejs.initNode('navigation_node')
    rosnodejs.reset()
    rosnodejs.shutdown()
    rosnodejs.initNode('navigation_node', {timeout:0})
    .then(()=>{
        res.json(util.successed_json)
    })
    .catch((err)=>{
        console.log(err)
        res.json(util.error_json)
    })
    
})

module.exports = router