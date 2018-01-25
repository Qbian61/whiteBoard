const express = require('express');
const app     = express();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);

const ws      = require('./src/ws');

io.on('connection', ws);

const port = 8082;

app.use(express.static('public'));

app.get('/', function (req, res){
    res.sendFile('/index.html');
});

app.get('/json', function (req, res) {
    res.send({name: 'lily'});
});

http.listen(port, function () {
    console.log(`listening on :${port}`);
});