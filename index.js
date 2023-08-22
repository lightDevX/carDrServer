const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//Middlewire

app.use(cors());
app.use(express.json());


