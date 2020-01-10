// 定义Chat类
var Chat = function (socket) {
  this.socket = socket;
}

// 发送聊天消息函数
Chat.prototype.sendMessage = function (room, text) {
  console.log(room, text);
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
}

// 变更房间函数
Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  });
}

// 处理聊天消息
Chat.prototype.processCommand = function (command) {
  var words = command.split(' ');
  var command = words[0].substring(1, words[0].length).toLowerCase();
  var message = false;

  switch (command) {
    case 'join': // 变更房间
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      break;
    case 'nick': // 昵称
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;
    default:
      message = 'Unrecognized command.';
      break;
  }
  return message;
}