const express = require('express')

const router = express.Router();

router.get('/virtual_obstacles', (req, res) => {
    let map_name = req.query.map_name;
    console.log("map name: " + map_name);
    res.json({"data":{"carpets":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"carpetsWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"decelerations":{"circles":[],"lines":[],"polygons":[],"polylines":[[{"x":6,"y":51},{"x":8,"y":52}]],"rectangles":[]},"decelerationsWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"displays":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"displaysWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"highlight":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"highlightWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"obstacles":{"circles":[{"x":72,"y":107,"r":5},{"x":87,"y":66,"r":2.5},{"x":77,"y":79,"r":2.5}],"lines":[],"polygons":[],"polylines":[[{"x":106,"y":51},{"x":108,"y":52}],[{"x":9,"y":59},{"x":13,"y":57},{"x":19,"y":59},{"x":18,"y":63}]],"rectangles":[[{"x":86,"y":35},{"x":93,"y":26}]]},"obstaclesWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[[{"x":-1.1227102611213926,"y":0.042556944116949325},{"x":-5.0227103192359213,"y":-2.0074430864304311}],[{"x":50.1772898625582453,"y":-2.6074430953711278},{"x":8.8772898878902193,"y":-4.457443122938276}]],"rectangles":[]},"slopes":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]},"slopesWorld":{"circles":[],"lines":[],"polygons":[],"polylines":[],"rectangles":[]}},"errorCode":"","msg":"successed","successed":true})
})

module.exports = router;