const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router();
const app = express();

const cors = require('cors')
// app.use(cors);

// app.use(bodyParser.urlencoded({
//     extended: false
// }));
// app.use(bodyParser.json());


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

var allowlist = ['http://192.168.123.113:8080', 'http://example2.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.options('*', cors())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.post('/cmd/add_position', (req, res) => {
    console.log(req.body)
    res.status(200);
    res.json({status:"ok"})

});
module.exports = app