var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    var d = new Date();
    msg.time = d.getTime();
    io.emit('chat message', msg);
  });
});

console.log('Listening on port 3000');