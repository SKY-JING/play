// 显示用户创建的受信内容
function divEscapedContentElement (message) {
  return $('<div></div>').text(message);
}

// 显示系统创建的受信内容
function divSystemContentElement (message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

// 处理原始用户输入
function processUserInput (chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#message').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message); // 给当前房间发送消息
    $('#messages').append(divEscapedContentElement(message)); // 将发送的消息添加到自己的聊天窗口
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val(''); // 清空当前输入框内容
}

// 客户端程序初始化逻辑
var socket = io.connect();

$(document).ready(function() {
  var chatApp = new Chat(socket);

  // 定义nameResult监听方法，用于监听用户新建或变更名称
  socket.on('nameResult', function (result) {
    var message;
    if (result.success) {
      message = 'You are known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  // 定义jionResult监听方法，用于监听用户加入新加入或切换房间
  socket.on('joinResult', function (result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  // 定义message监听方法，用于监听用户消息
  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  // 定义rooms监听方法，用于监听房间列表
  socket.on('rooms', function (rooms) {
    $('#room-list').empty();
    for (var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }
    $('#room-list div').click(function () {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  // 定时更新房间列表数据
  setInterval(function () {
    socket.emit('rooms');
  }, 1000);

  // 发送消息输入框获取焦点
  $('#send-message').focus();

  // 发送按钮点击事件
  $('#send-form').submit(function () {
    processUserInput(chatApp, socket);
    return false;
  })
})