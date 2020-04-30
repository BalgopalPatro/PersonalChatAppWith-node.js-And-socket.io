var socket = io.connect('http://localhost:3000');
// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    console.log( $('#txt').val());
    // socket.emit('chat_message', $('#txt').val());
    $('#messages').append(`<li class="own">${$('#txt').val()}<li>`);
    socket.emit('private_message',$('#txt').val(),$('#to').val())
    $('#txt').val('');
   
    return false;
});
// append the chat text message
socket.on('chat_message', function(msg,user){
    if(user === username){
        $('#messages').append(`<li class="own">${msg}<li>`);
    }else{
        $('#messages').append($('<li>').html(msg));
    }
    console.log(user);
});
// append text if someone is online
socket.on('is_online', function(username) {
    $('#messages').append($('<li>').html(username));
});
// ask username
// var username = prompt('Please tell me your name');
// var pin = prompt('Please enter your pin');

socket.emit('username', username,pin);  

socket.on('private_message',(msg,from)=>{
    $('#messages').append($('<li>').html(from +"Private : "+ msg));
})

socket.on('auth_err',(msg)=>{
    alert(msg);
})

document.getElementById('to').onkeyup = function(){
    console.log("Typing..."+$('#to').val());
    socket.emit('get_user',$('#to').val());
}

socket.on('suggested_user',(rst)=>{
    console.log(rst.length);
    var data = [];
    $('#sug').empty();
    rst.forEach((a)=>{
        console.log(a.username);
        $('#sug').append(($('<li>').html(a.username)));
    })
})


