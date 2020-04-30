var socket = io.connect('http://192.168.43.142:3000');
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
var username = prompt('Please tell me your name');
socket.emit('username', username);

socket.on('private_message',(msg,from)=>{
    $('#messages').append($('<li>').html(from +"Private : "+ msg));
})
