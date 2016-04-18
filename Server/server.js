
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000


//AB0 == AbuDhabi Begin 0, i.e. the very start.
//SE1 == Shanghai End 1, i.e. the very end.
var deviceList = ["AB0","AE0","SB0","SE0","AB1","AE1","SB1","SE1","AB2"]	//in order!


var AB0Running = false;
var SB0Running = false;
var AB1Running = false;
var SB1Running = false;
var AB2Running = false;

// var AE0Done = false;
// var SE0Done = false;
// var AE1Done = false;
// var SE1Done = false;

// Logic:
// Any Begin device (AB0 for instance) constantly polls the server. The response (what I'll refer to
// as that device's 'go-flag') will be "0" (*wait*) until the server is ready to start that device. 
// When the go-flag is set to "1", that device begins running.

// Once the server recieves a request from an End device (SE0, f'rinstance), it automatically sets the 
// go-flag for the next device in the chain to "1", (*goooo!*)


// Because Heroku doesn't like websockets?
// https://github.com/nodejs/node/wiki/Socket.IO-and-Heroku
// io.set('transports', ['xhr-polling']);
// io.set('polling duration', 10);



//BEGIN ROUTES
app.get("/devices/:deviceData", function(req, res){
	
	io.emit("updateInfo", "InfoUpdated!!");
	var info = req.params.deviceData;

	var parsedInfo = info.split("+");

	if(parsedInfo[0] == "Begin"){
		//Start the machine by setting AB0Run to true
		AB0Running = true;
		io.emit("updateAB0", "true");
		res.send("Starting");

	}

	if(parsedInfo[0] == deviceList[0]){
		//Abu Dhabi Begin 0
		if(AB0Running){
			res.send("1");
		}else{
			io.emit("updateAB0", "Connecting, false");
			res.send("0");
		}


	}else if(parsedInfo[0] == deviceList[1]){
		//Abu Dhabi End 0
		//Only called if AE0 is done, so:

		SB0Running = true;
		io.emit("updateAE0", "true");
		res.send("2");
	}
	else if(parsedInfo[0] == deviceList[2]){
		//Shanghai Begin 0

		if(SB0Running){
			io.emit("updateSB0", "true");
			res.send("1");
		}else{
			io.emit("updateSB0", "Connecting, false");
			res.send("0");
		}
	}
	else if(parsedInfo[0] == deviceList[3]){
		//Shanghai End 0
		
		AB1Running = true;
		io.emit("updateSE0", "true");
		res.send("3");
	}
	else if(parsedInfo[0] == deviceList[4]){
		//Abu Dhabi Begin 1

		if(AB1Running){
			io.emit("updateAB1", "true");
			res.send("1");
		}else{
			io.emit("updateAB1", "Connecting, false");
			res.send("0");
		}
	}
	else if(parsedInfo[0] == deviceList[5]){
		//Abu Dhabi End 1
		SB1Running = true;
		io.emit("updateAE1", "true");
		res.send("4");
	}
	else if(parsedInfo[0] == deviceList[6]){
		//Shanghai Begin 1
		if(SB1Running){
			io.emit("updateSB1", "true");
			res.send("1");
		}else{
			io.emit("updateSB1", "Connecting, false");
			res.send("0");
		}
	}
	else if(parsedInfo[0] == deviceList[7]){
		//Abu Dhabi End 1
		SB1Running = true;
		io.emit("updateSE1", "true");
		res.send("6");
	}
	else if(parsedInfo[0] == deviceList[7]){
		//Shanghai End 1
		
		AB2Running = true
		//Do whatever picture/GIF taking necessary.

		//Reset system.
		resetFlags();
	}
	else if(parsedInfo[0] == deviceList[8]){
		//Shanghai Begin 1
		if(AB2Running){
			io.emit("updateAB2", "true");
			res.send("1");
		}else{
			io.emit("updateAB2", "Connecting, false");
			res.send("0");
		}
	}
	else if(parsedInfo[0] == "reset"){
		resetFlags();
  		res.send('resetting');
	}


	else if(parsedInfo[0] == "info"){

		var response = sendInfo();
  		res.send(response);
	}

	else{
		res.send("9");
	}

	console.log("Received Device Request. We get this: " + info)

	

});

var sendInfo = function(){
	var response = ""

	response += "<b>Abu Dhabi Begin 0: </b>";
	response += AB0Running;

	response += "<br/><b>Shanghai Begin 0: </b>";
	response += SB0Running;

	response += "<br/><b>Abu Dhabi Begin 1: </b>";
	response += AB1Running;

	response += "<br/><b>Shanghai Begin 1: </b>";
	response += SB1Running;

	return response
}



app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/next', function(req, res){
	console.log("Next request, sending")
	res.send("Moving on!");
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit("connectionMessage", "Sendthis!");
  io.emit("updateAB0", AB0Running);
  io.emit("updateAE0", AB0Running);
  io.emit("updateSB0", SB0Running);
  io.emit("updateSE0", SB0Running);
  io.emit("updateAB1", AB1Running);
  io.emit("updateAE1", AB1Running);
  io.emit("updateSB1", SB1Running);
  io.emit("updateSE1", SB1Running);
  io.emit("updateAB2", AB2Running);


  socket.on('connection', function (data) {
    	console.log(data);   });
  socket.on('atime', function (data) {
	  	sendTime();
    	console.log(data);
    });


});

http.listen(port, function(){
  console.log('listening on' +  port);
});

//END ROUTES


var resetFlags = function(){
	AB0Running = false;

	SB0Running = false;

	AB1Running = false;

	SB1Running = false;

}