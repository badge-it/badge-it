// Requiring dependencies
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

// Creating server
const app = express();
const server = http.createServer(app);

// Configruing server
app.use(express.json());
app.use(cors())
dotenv.config()

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))