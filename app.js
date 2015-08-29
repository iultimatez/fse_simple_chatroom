var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var dbFile = './chatHistory.db';
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(dbFile);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/getHistory', function (req, res) {
	db.all("SELECT * FROM history", function(err, rows){
		res.json(rows);
	})
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
    db.run("INSERT INTO history (user, content, timestamp) VALUES (?, ?, ?)", msg.usr, msg.msg, msg.time);
    io.emit('chat message', msg);
  });
});

console.log('Listening on port 3000');