require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require("./Router/auth-router"); // Adjust path as necessary
const connectToDatabase = require("./utils/db");

// CORS configuration to allow multiple origins
const corsOptions = {
  origin: ['https://e-commerce-frontend-xi-eight.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight OPTIONS request

// Debugging middleware to check headers
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(bodyParser.json());

app.use("/", router);

// Test CORS with a simple route
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

const PORT = 5000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});
