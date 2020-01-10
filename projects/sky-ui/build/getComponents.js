const fs = require('fs');
const path = require('path');

const excludes = [
  'style',
  'mixins',
  'utils',
  'index.ts',
  'index.less',
  '.DS_Store'
];

module.exports = () => {
  const dirs = fs.readdirSync(path.resolve(__dirname, '../packages'));
  return dirs.filter(dirName => excludes.indexOf(dirName) === -1);
};