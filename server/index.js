require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require("./Router/auth-router"); // Adjust path as necessary
const connectToDatabase = require("./utils/db");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/",router);

// app.get("/",(req ,res) => {
//     res.status(200).send("welcome");
// });

// app.get("/register",(req ,res) => {
//     res.status(200).send("welcome to registration page");
// });


const PORT = 5000;

connectToDatabase().then(()=> {
app.listen(PORT,()=>{
    console.log(`Server is running at port : ${PORT}`);
    });
});