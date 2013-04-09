({

  baseUrl: "../js/",

  mainConfigFile: '../js/main.js',

  name: 'main',

  include: ['lib/almond'],

  //define mobile specific script output
  out: '../js/min/mobile.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  namespace: "wpAdRequire",

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

    //define mobile site specific script here:
    'siteScript': 'wp_mobile/main'
  },

  shim: {
    'jqueryUI':{
      deps: ['jquery'],
      exports: '$'
    }
  }

})