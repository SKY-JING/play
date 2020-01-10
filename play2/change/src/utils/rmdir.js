const fs = require('fs');

function rmdir (path) {
  // check whether the path exists
  try {
    fs.statSync(path);
  } catch (e) {
    return;
  }
  // remove file
  rmFile(path);
  // remove empty dir
  rmEmptyDir(path);
}

function rmFile (path) {
  let files = fs.readdirSync(path);
  files.forEach(file => {
    let state = fs.statSync(path + '/' + file);
    if (state.isDirectory()) {
      rmFile(path + '/' + file);
    } else {
      fs.unlinkSync(path + '/' + file);
    }
  });
}

function rmEmptyDir (path) {
  let dirs = fs.readdirSync(path);
  if (dirs.length) {
    dirs.forEach(dir => {
      fs.rmdirSync(path + '/' + dir);
    });
  }
  fs.rmdirSync(path);
}

module.exports = {
  rmdir
};