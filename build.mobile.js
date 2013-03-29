({

  baseUrl: "js/",

  //define mobile specific script output
  mainConfigFile: 'js/adScript.js',

  name: 'adScript',

  include: ['almond'],

  out: 'js/adScript-mobile.js',

  //for testing
  //optimize: 'none',

  namespace: "adsRequire",

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