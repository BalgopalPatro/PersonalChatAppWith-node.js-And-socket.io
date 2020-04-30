require('./config/config');
require('./models/db')
const express = require('express');
const app = express();
const engines = require('consolidate');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').Server(app);
const server = app.listen(process.env.PORT,()=>{console.log(process.env.PORT)})
const io = require('socket.io').listen(server);
const mongoose = require('mongoose');

const mysql = require('./models/mysql');

const connection = mysql.connection;

connection.connect((err)=>{
  if(err){
    console.log(err); 
  }else{
    console.log("mysql Connected")
  }
});

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

    socket.on('username', function(username,pin) {
        socket.username = username;
         connection.query(`INSERT INTO user values('${username}',${pin})`,(err,res)=>{
          if(err){
            if(err.code == 'ER_DUP_ENTRY'){
              connection.query(`SELECT * from users where username = '${username}' `,(err,res) =>{
                if(err){
                  console.log(err);
                }else{
                  console.log(res);
                  console.log(res[0].pin);
                  if(res[0].pin == pin){
                    console.log("Password Matched");  
                    io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
                  }else{
                    io.to(socket.id).emit('auth_err',"Wrong Password");
                  }
                }
              })
            }
          }else{
            console.log(res);
            console.log(`newuser created : ${username}`);
            io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
          }
        });
        console.log(username+" Connected with id : "+socket.id);
        users[username] = socket.id ; 
        
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

  socket.on('get_user',function(name){
    connection.query(`select username from users where username like '${name}%'`,function(err,res){
      io.to(socket.id).emit('suggested_user',res);
    })
  })

  socket.on('valid_user',function(username){
    connection.query(`select username from users where username like '${username}'`,function(err,res){
      console.log('Hello');
      if(res.length > 0){
        if(res[0].username === username){
          io.to(socket.id).emit('is_Valid_user',true);
        }
      }else{
        io.to(socket.id).emit('is_Valid_user',false);
      }
    })
  });

});

var Message = mongoose.model('Message',{
    name : String,
    message : String
  })

  app.get('/login', (req, res) => {
    res.render('entry');
    // Message.find({},(err, messages)=> {
    //   res.send(messages);
    // })
  })

// app.listen(process.env.PORT, () => { console.log(`Server started at port ${process.env.PORT} `) });
