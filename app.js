const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send("Hello BG");
})

app.listen(3000,()=>{
    "Service start at 3000 Port"
})