"use strict";function insertionSort(r){for(var e,t,o=r.length,n=1;n<o;n++){for(e=n-1,t=r[n];0<=e&&r[e]>t;)r[e+1]=r[e],e--;r[e+1]=t}return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports.insertionSort=insertionSort;