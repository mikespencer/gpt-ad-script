({

  baseUrl: "../js/",

  mainConfigFile: '../js/adScript.js',

  name: 'adScript',

  include: ['almond'],

  //define wp specific script output
  out: '../js/min/wp.js',

  //for testing
  //optimize: 'none',

  namespace: "wpAdRequire",

  paths: {
    //'googletag': 'http://www.googletagservices.com/tag/js/gpt',
    'googletag': 'lib/gpt',
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

    //define wp site specific script here:
    'siteScript': 'wp/main'
  },

  shim: {
    'googletag': {
      exports: 'googletag'
    },
    'jqueryUI':{
      deps: ['jquery'],
      exports: '$'
    }
  }

})