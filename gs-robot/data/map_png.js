#!/usr/bin/env node

const express = require('express');
const router = express.Router();

router.get('/map_png', async function(req, res){
    let map_name = req.query.map_name;

    let path = require('path');
    res.sendFile(path.resolve(__dirname, './maps/' + map_name + '.png'));
});
 
module.exports=router
