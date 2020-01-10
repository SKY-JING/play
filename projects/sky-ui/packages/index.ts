// This file gererated by build/build-entry.js
import Icon from './icon';
import { VueConstructor } from 'vue/types';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const components = [
  Icon
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

const version = '1.0.0';

export {
  install,
  version,
  Icon
};

export default {
  install,
  version
};
