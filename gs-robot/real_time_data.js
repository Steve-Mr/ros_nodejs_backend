const express = require('express')
const router = express.Router()
console.log('router realtime data starting')


router.use('/real_time_data', require('./real_time_data/cmd_vel'));
router.use('/real_time_data', require('./real_time_data/amcl_pose'));
// router.use('/real_time_data', require('./real_time_data/sub_topic'));
router.use('/real_time_data', require('./real_time_data/position'))
// router.use('/real_time_data', require('./real_time_data/position_alt'))
console.log('router realtime data')

// CommonJS 规范，被导出内容可以在其他文件中通过 require 方式进行调用
// 可以导出多个参数/方法
module.exports = router