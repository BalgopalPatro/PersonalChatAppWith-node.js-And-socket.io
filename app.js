require('./config/config');
require('./models/db')
const express = require('express');
const app = express();
const engines = require('consolidate');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').Server(app);
const server = app.listen(process.env.PORT,'192.168.43.142',()=>{console.log(process.env.PORT)})
const io = require('socket.io').listen(server);
const mongoose = require('mongoose');

const mysql = require('mysql');

mysql.


app.use(bodyParser.json());
app.use(cors());
express.static(__dirname);
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(express.static('Public'));

app.get('/', (req, res) => {
    res.render('index');
})

var users = [] ;

io.sockets.on('connection', function(socket) {

    socket.on('username', function(username) {
        socket.username = username;
        console.log(username+" Connected with id : "+socket.id);
        users[username] = socket.id ; 
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message,socket.username);
    });

    socket.on('private_message', function(message,to) {
      io.to(users[to]).emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message,socket.username);
  });

});

var Message = mongoose.model('Message',{
    name : String,
    message : String
  })

  app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })

// app.listen(process.env.PORT, () => { console.log(`Server started at port ${process.env.PORT} `) });

