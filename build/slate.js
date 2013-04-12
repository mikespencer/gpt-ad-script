({

  baseUrl: "../js/",

  mainConfigFile: '../js/main.js',

  name: 'lib/almond',

  include: ['main'],

  //define wp specific script output
  out: '../js/min/slate.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

    //define wp site specific script here:
    'siteScript': 'slate/main'
  },

  shim: {
    'jqueryUI':{
      deps: ['jquery'],
      exports: '$'
    }
  }

})