const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const config = require('../config');
const { rmdir } = require('../src/utils/rmdir');
const { md2html } = require('./md2html');
const { word2html } = require('./word2html');

rmdir(path.join(__dirname, '../', config.outDir));

// type: path(default) or stream
function anyToHtml (url, type) {
  type = type || 'path';
  switch (type) {
    case 'path':
      dealPath(path.join(__dirname, url), '');
      break;
    case 'stream':
      dealStream(url);
  }
}

// read by path
function dealPath (url, dir) {
  let outDir = path.join(__dirname, '../', config.outDir + (dir ? '/' + dir : ''));
  let files = fs.readdirSync(url);
  if (files.length) {
    fs.mkdirSync(outDir);
  }
  files.forEach(file => {
    let stat = fs.statSync(url + '/' + file);
    if (stat.isDirectory()) {
      dealPath(url + '/' + file, dir + '/' + file);
    } else {
      let fileName = file.split('.')[0];
      let fileType = file.split('.')[file.split('.').length - 1];
      switch (fileType) {
        case 'md':
          dealMd(url + '/' + file, outDir, fileName);
          break;
        case 'doc':
        case 'docx':
          dealWord(url + '/' + file, outDir, fileName);
          break;
      }
    }
  });
}

// read by stream
function dealStream (url) {}

// deal md file
function dealMd (url, outDir, fileName) {
  fs.readFile(url, 'utf-8', (err, data) => {
    if (err) {
      return;
    }
    writeFile(md2html(data), outDir, fileName);
  });
}

// deal doc、docx file
function dealWord (url, outDir, fileName) {
  // fs.copyFile(url, outDir + '/' + fileName + '.zip', err => {});
  // fs.createReadStream(outDir + '/' + fileName + '.zip');
  // let stream = fs.createReadStream(url, 'base64');
  // let bufArr = [], size = 0;
  // stream.on('data', buf => {
  //   bufArr.push(buf);
  //   size += buf.length;
  // });
  // stream.on('end', () => {
  //   let buff = Buffer.concat(bufArr, size);
  // });
}

// write file
function writeFile (data, outDir, fileName) {
  let obj = {
    title: fileName,
    data: data
  };
  fs.readFile(path.join(__dirname, './template.tpl'), 'utf-8', (err, content) => {
    if (err) throw err;
    fs.writeFile(`${outDir}/${fileName}.html`, content.replace(/<%=\s{1,}\w+\s{1,}%>/gi, word => {
      let key = word.replace(/\s{2,}/g, ' ').split(' ')[1];
      return obj[key];
    }), 'utf8', (err) => {
      if (err) throw err;
      // console.log(fileName + '.html 完成');
    });
  });
}

anyToHtml('../docs');