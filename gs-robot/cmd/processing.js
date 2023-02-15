const express = require('express')
const path = require('path')
const pgmjs = require('pgmjs')
const util = require('../util')
const canvas = require('canvas')
const fs = require('fs')
const pngToPgm = require('pngtopgm')

const app = express()

app.get('/processing', (req, res) => {
    let map_path = '/home/maary/slam/scout_ws/src/navigation/map/test.pgm'
    let png_path = '/home/maary/test.png'
    let pgm_path = '/home/maary/test_mod.pgm'
    pgmjs.readPgm(map_path).then((pgmdata) => {
        pgmjs.writePngFromPgm(pgmdata, '/home/maary/test.png').then(() => {
            
            fs.readFile(png_path, function(err, data){
                let img = new canvas.Image
                img.src = data
                let can = canvas.createCanvas(img.width, img.height)
                const ctx = can.getContext('2d')
                ctx.drawImage(img, 0, 0)
                ctx.lineWidth = 5
                ctx.moveTo(0,0)
                ctx.lineTo(100, 100)
                ctx.stroke()

                const buffer = can.toBuffer("image/png")
                fs.writeFile(png_path, buffer, (err) => {
                    if(err){
                        console.log(err)
                        res.json(util.error_json)
                    }
                    fs.readFile(png_path, (err, data) => {
                        pngToPgm(data).then((result) => {
                            fs.writeFileSync(pgm_path, result)
                        })
                    })

                })
            })
            
            res.json(util.successed_json)

        })
    }).catch((err) => {
        console.log(err)
        res.json(util.error_json)
    })
})

module.exports = app