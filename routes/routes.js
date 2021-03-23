const express = require('express');
let router = express.Router();
const path = require('path');
const publicDirectory = path.join(__dirname, '../public')


router.get('/test', (req,res)=>{
    res.sendFile(publicDirectory + '/index.html')
})

module.exports = router;