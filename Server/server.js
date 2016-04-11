var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000


//Because Heroku doesn't like websockets?
io.configure(function () {  
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/next', function(req, res){
	res.send("Moving on!");
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(port, function(){
  console.log('listening on' +  port);
});