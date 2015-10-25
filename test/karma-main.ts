///<reference path="../typings/requirejs/require.d.ts"/>

'use strict';
interface Window {
    __karma__: {
        files: {
            [fileName: string]: string
        },
        start: () => any
    };
}

var tests: string[] = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/\.spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/.tmp/src',

    paths: {

    },

    shim: {

    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
