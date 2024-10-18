import express from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";

// Importing connection.js for developing the connection with the mySQL-DB.
import connectToDatabase from "./src/config/dbConfig.js";

dotenv.config();

const app = express();

// Middleware to parse incoming JSON
app.use(bodyParser.json());

const port  = process.env.PORT || 5001;

app.use(express.json());

app.use(cors());

// Establish a database connection
const connection = await connectToDatabase();

app.get("/", (req, res) => {
    res.json("Helloooo MEDIC");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default connection;