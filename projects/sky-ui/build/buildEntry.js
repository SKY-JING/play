const fs = require('fs-extra');
const path = require('path');
const packageJson = require('../package.json');
const componentList = require('./getComponents')();
const uppercamelcase = require('uppercamelcase');

const version = process.env.VERSION || packageJson.version;

~function () {
  const uninstall = [
    'Locale',
    'Lazyload',
    'Waterfall'
  ];

  const importList = componentList.map(item => `import ${uppercamelcase(item)} from './${item}';`);
  const exportList = componentList.map(item => `${uppercamelcase(item)}`);
  const intallList = exportList.filter(name => !~uninstall.indexOf(uppercamelcase(name)));
  const content = `// This file gererated by build/build-entry.js
${importList.join('\n')}
import { VueConstructor } from 'vue/types';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const components = [
  ${intallList.join(',\n  ')}
];

const install = (Vue: VueConstructor) => {
  components.forEach(item => {
    Vue.use(item);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const version = '${version}';

export {
  install,
  version,
  ${exportList.join(',\n  ')}
};

export default {
  install,
  version
};
`;

  fs.writeFileSync(path.join(__dirname, '../packages/index.ts'), content);
}();