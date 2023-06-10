/**
 * 添加或更新虚拟墙数据
 * 
 * 虚拟墙数据全部传过来，全部更新一遍，不管是新添加还是更新某个虚拟墙
 * 
 * POST 请求 /robot/cmd/update_virtual_obstacles?map_name=?&obstacle_name=?
 * 
 * 请求体同获取虚拟墙返回 data 字段
 */
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const util = require('../util')

const pgmjs = require('pgmjs')
const canvas = require('canvas')
const pngToPgm = require('pngtopgm')
const yaml = require('js-yaml')

const app = express();

app.options('*', cors())
app.use(cors())

app.post('/update_virtual_obstacles', (req, res) => {
    let map_path = path.join(__dirname, '..', '..', '..', '..', 'navigation', 'map')
    let map_name = req.query.map_name;
    let obstacle_name = req.query.obstacle_name;
    console.log("map name: " + map_name + " obstacle name: " + obstacle_name);

    pgmjs.readPgm(path.join(map_path, map_name + '.pgm')).then((pgmdata) => {
        pgmjs.writePngFromPgm(pgmdata, path.join(map_path, map_name + '.png')).then(() => {
            fs.readFile(path.join(map_path, map_name + '.png'), (err, data) => {
                let img = new canvas.Image
                img.src = data
                const doc = yaml.load(fs.readFileSync(path.join(map_path, map_name + '.yaml')))
                let originP = {
                    x: doc.origin[0],
                    y: doc.origin[1]
                }
                let can = canvas.createCanvas(img.width, img.height)
                const ctx = can.getContext('2d')
                ctx.drawImage(img, 0, 0)
                let obstacles = req.body
                for(let obstacle_type in obstacles){
                    if(!obstacle_type.includes("World")){
                        let obj = obstacles[obstacle_type]
                        // let obj = obstacle_type
                        for (let shape in obj){
                            // console.log(shape.toString())
                            switch(shape.toString()){
                                case "circles":
                                    for(let circle in obj[shape]){
                                        console.log(JSON.stringify(obj[shape][circle]))
                                        let p = util.getCoord(obj[shape][circle], originP, img.height, doc.resolution)
                                        let r = Math.round(obj[shape][circle].r/doc.resolution)
                                        console.log(p.x + " " + p.y + " " + r)
                                        ctx.beginPath()
                                        ctx.arc(p.x, p.y, r, 0, 2 * Math.PI, false)
                                        ctx.fillStyle = 'black'
                                        ctx.fill()
                                    }
                                    break;
                                case "lines":
                                    for(let line in obj[shape]){
                                        let p0 = util.getCoord(obj[shape][line][0], originP, img.height, doc.resolution)
                                        let p1 = util.getCoord(obj[shape][line][1], originP, img.height, doc.resolution)
                                        console.log(p0.x + " ", p0.y)
                                        console.log(p1.x + " ", p1.y)
                                        console.log(img.height + " " + img.width)
                                        ctx.lineWidth = 5
                                        ctx.moveTo(p0.x, p0.y)
                                        ctx.lineTo(p1.x, p1.y)
                                        ctx.stroke()
                                    }
                                    break;
                                case "polygons":
                                    for(let pgon in obj[shape]){
                                        let points = obj[shape][pgon]
                                        ctx.beginPath()
                                        for(let point in points){
                                            let p = util.getCoord(points[point], originP, img.height, doc.resolution)
                                            ctx.lineTo(p.x, p.y)
                                        }
                                        ctx.closePath()
                                        ctx.fillStyle = 'black'
                                        ctx.fill()
                                    }
                                    break;
                                case "polylines":
                                    for(let pline in obj[shape]){
                                        let points = obj[shape][pline]
                                        ctx.lineWidth = '5'
                                        ctx.beginPath()
                                        for(let point in points){
                                            let p = util.getCoord(points[point], originP, img.height, doc.resolution)
                                            ctx.lineTo(p.x, p.y)
                                        }
                                        ctx.stroke()
                                    }
                                    break;
                                case "rectangles":
                                    for(let rect in obj[shape]){
                                        let p0 = util.getCoord(obj[shape][rect][0], originP, img.height, doc.resolution)
                                        let p1 = util.getCoord(obj[shape][rect][1], originP, img.height, doc.resolution)
                                        ctx.beginPath()
                                        ctx.lineWidth = '5'
                                        ctx.rect(p0.x, p0.y, p1.x-p0.x, p1.y-p0.y)
                                        ctx.fillStyle = 'black'
                                        ctx.fill()
                                    }
                                    break;
                            }
                        }
                    }
                }
                const buffer = can.toBuffer('image/png')
                fs.writeFile(path.join(map_path, map_name + '.png'), buffer, (err) => {
                    if(err){
                        console.log(err)
                        res.json(util.error_json)
                    }
                    fs.readFile(path.join(map_path, map_name + '.png'), (err, data) => {
                        pngToPgm(data).then((result) => {
                            fs.writeFile(path.join(map_path, map_name+'_mod.pgm'), result, (err) => {
                                if(err){
                                    console.log(err)
                                }
                                fs.unlinkSync(path.join(map_path, map_name + '.png'))
                                doc.image = map_name + '_mod.pgm'
                                fs.writeFileSync(path.join(map_path, map_name+'_mod.yaml'), yaml.dump(doc))
                            })
                        })
                    })
                })
            })
        })
    })

    

    fs.writeFile(
        path.join(__dirname, '..', 'data', 'obstacles',map_name),
        JSON.stringify(req.body),
        {flag: 'w+'}, 
        err => {
            if (err) {
                res.json(util.error_json);
                return console.log(err.message);
              }
              res.status(200);
              res.json(util.successed_json)
        })
});

module.exports = app