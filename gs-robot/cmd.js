const express = require('express')
const router = express.Router()
const app = express();

const cors = require('cors')

app.use(cors);

// app.use(function(req, res, next) {
        
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-Origin", "*");

//     if (req.method === "OPTIONS") {
//         return res.status(200);
//     }

//     // console.log(req)
//     next();
// });

app.use('/cmd', require('./cmd/add_position'));
module.exports = app