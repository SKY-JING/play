const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const svgDir = path.join(__dirname, '../assets/svg');
const sketch = path.join(__dirname, '../assets/icons.sketch');

fs.removeSync(svgDir);

// https://developer.sketch.com/cli/
shell.exec(
  `/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices --formats=svg --overwriting=YES --save-for-web=YES --output=${svgDir} ${sketch}`
);

shell.exec('svgo ./assets/svg/*.svg');