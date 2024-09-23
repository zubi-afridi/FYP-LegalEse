require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/router");
const cors = require("cors")
const port = 8004;


// middle ware
app.use(express.json());
app.use(cors());
app.use(router)

app.get("/",(req,res)=>{
    res.send("start server")
})
app.listen(port,()=>{
    console.log(`server start at port no :${port}`)
})