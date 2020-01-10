var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

// 缓存
var cache = {};

// 请求资源不存在时发送404
function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: resource not foune.');
  res.end();
}

// 发送文件内容
function sendFile (res, filePath, fileContents) {
  res.writeHead(200, {
    'Content-Type': mime.getType(path.basename(filePath))
  });
  res.end(fileContents);
}

// 静态文件服务
function serveStatic (res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}

// http服务器
var server = http.createServer(function (req, res) {
  var filePath = false;
  if (req.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }
  var absPath = './' + filePath;
  serveStatic(res, cache, absPath);
});

// 启动http服务
server.listen(3001, function () {
  console.log('server listening on port 3001');
});

// 设置socket.io服务器 （使它和http服务器公用一个端口)
var chatServer = require('./lib/chat_server');
chatServer.listen(server);