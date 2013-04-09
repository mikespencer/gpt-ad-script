({

  baseUrl: "../js/",

  mainConfigFile: '../js/main.js',

  name: 'main',

  include: ['lib/almond'],

  //define wp specific script output
  out: '../js/min/wp.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  namespace: "wpAdRequire",

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

    //define wp site specific script here:
    'siteScript': 'wp/main'
  },

  shim: {
    'jqueryUI':{
      deps: ['jquery'],
      exports: '$'
    }
  }

})