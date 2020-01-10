var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = [];
var namesUsed = [];
var currentRoom = {};

// 启动socket.io服务器
exports.listen = function (server) {
  io = socketio.listen(server);
  io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // 用户连接时赋予其一个访客名
    joinRoom(socket, 'Lobby'); // 用户连接上来时把他放在lobby聊天室
    handleMessageBroadcasting(socket, nickNames); // 处理用户的消息
    handleNameChangeAttempts(socket, nickNames, namesUsed); // 更名
    handleRoomJoining(socket); // 创建和变更房间

     socket.on('rooms', function() {
       socket.emit('rooms', io.sockets.manager.rooms);
     });

     handleClientDisconnection(socket, nickNames, namesUsed); // 定义用户断开连接后的处理逻辑
  });
}

// 分配用户昵称
function assignGuestName (socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

// 进入聊天室的相关逻辑
function joinRoom (socket, room) {
  socket.join(room); // 让用户进入房间
  currentRoom[socket.id] = room; // 记录用户的当前房间
  socket.emit('joinResult', {room: room});
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  var usersInRoom = io.sockets.clients(room);
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + '.';
    for (var index in usersInRoom) {
      var usersSocketId = usersInRoom[index].id;
      if (usersSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ',';
        }
        usersInRoomSummary += nickNames[usersSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary});
  }
}

// 处理更名请求
function handleNameChangeAttempts (socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function (name) {
    if (name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) === -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known an ' + name + '.'
        });
      } else { // 名称已被占用
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in user'
        });
      }
    }
  });
}

// 转发消息
function handleMessageBroadcasting (socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

// 创建房间
function handleRoomJoining (socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

// 断开用户连接
function handleClientDisconnection (socket) {
  socket.on('disconnect', function () {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  })
}