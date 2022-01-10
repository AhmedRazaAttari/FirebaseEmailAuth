const express = require('express');
const app = express();
var cors = require('cors')
const server = require("http").createServer(app);
const bodyParser = require('body-parser');

app.use(cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com'],
    methods: ['GET', 'POST']
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Running');
});

app.use('/', require('./route/index'));

server.listen(process.env.PORT || 5000, () => {
    console.log("Server is listening")
})