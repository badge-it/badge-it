// Requiring Dependencies
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv'); // Ni jgn ubah liao , biar lbh enak liat

// Creating Server
const app = express();
const server = http.createServer(app);

// Configuring server
app.use(express.json());
app.use(cors())
dotenv.config() // See this

// Configuring routers
const RepoRouter = require('./Routers/repo.router');
app.use('/repo', RepoRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))