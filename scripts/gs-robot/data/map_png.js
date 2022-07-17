#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/map_png', (req, res) => {
 var path=require('path');
  res.sendFile(path.resolve(__dirname,'./map.png'));
 })
 
module.exports=router
