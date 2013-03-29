({

  baseUrl: "../js/",

  mainConfigFile: '../js/adScript.js',

  name: 'adScript',

  include: ['almond'],

  //define mobile specific script output
  out: '../js/min/mobile.js',

  //for testing
  //optimize: 'none',

  namespace: "wpAdRequire",

  paths: {
    //'googletag': 'http://www.googletagservices.com/tag/js/gpt',
    'googletag': 'lib/gpt',
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

    //define mobile site specific script here:
    'siteScript': 'wp_mobile/main'
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