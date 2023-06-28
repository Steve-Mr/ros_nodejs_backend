const express = require('express')
const app = express();

// app.use('/cmd', require('./cmd/add_position'));
// app.use('/cmd', require('./cmd/delete_position'))
// app.use('/cmd', require('./cmd/update_virtual_obstacles'))
// // 这里 navigate 后面多加了 .router 是因为其还导出了其他项，指定这里应该路由到 navigate 的 router 
// app.use('/cmd', require('./cmd/position/navigate.js').router)
// app.use('/cmd', require('./cmd/pause_navigate'))
// app.use('/cmd', require('./cmd/resume_navigate'))
// app.use('/cmd', require('./cmd/cancel_navigate'))
// app.use('/cmd', require('./cmd/rename_position'))
// // app.use('/cmd', require('./cmd/init_rosnode'))
// // app.use('/cmd', require('./cmd/load_map'))
// app.use('/cmd', require('./cmd/pub_topic'))
// app.use('/cmd', require('./cmd/position/add_position'))
app.use('/cmd', require('./cmd/position/navigate_ros2.js').router)

module.exports = app