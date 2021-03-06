var socket = io();

var begin = 1;

var userName;

$.get('/getHistory', function(data){
	console.log(data);
	for (var i = 0; i < data.length; i++) {
		var msg = data[i];
		console.log(msg);
		var d = new Date(msg.timestamp);
		var msgLabel = '<blockquote><h4>' + msg.user + '</h4><p>'+ msg.content +'</p><footer><cite>' + d + '</cite></footer></blockquote>';
		var temp = $(msgLabel);
		content.append(temp);
	};
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

var sendBtn = $('#sendInput');
sendBtn.on('click', function(e){
	//console.log('clicked');
	var msg = $('#inputMsg').val();

	var obj = {'usr': '', 'msg': '', 'time': ''};

	if (msg === "") {
		console.log("Empty!");
		return false;
	}else{
		if (begin == 1) {
			$("#userName").text(msg + ': ');
			$("#sendInput").text('Send!');
			$("#inputMsg").attr("placeholder", "Type your messages...");
			userName = msg;
			begin = 2;
		}else{
			obj['usr'] = userName;
			obj['msg'] = msg;
			socket.emit('chat message', obj);
		}
		$("#inputMsg").val('');
		$('#inputMsg').focus();
	}
	return false;
});

var content = $('.content');

socket.on('chat message', function(msg){
    console.log(msg);
	var d = new Date(msg.time);
	var msgLabel = '<blockquote><h4>' + msg.usr + '</h4><p>'+ msg.msg +'</p><footer><cite>' + d + '</cite></footer></blockquote>';
	var temp = $(msgLabel);
	content.append(temp);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
  });

$('#inputMsg').on("keydown", function(e){
	if(e.which === 13){
		return false;
	}
})