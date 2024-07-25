require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./Router/auth-router");
const connectDb = require("./utils/db");
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use("/",router);

// app.get("/",(req ,res) => {
//     res.status(200).send("welcome");
// });

// app.get("/register",(req ,res) => {
//     res.status(200).send("welcome to registration page");
// });


const PORT = 5000;

connectDb().then(()=> {
app.listen(PORT,()=>{
    console.log(`Server is running at port : ${PORT}`);
    });
});