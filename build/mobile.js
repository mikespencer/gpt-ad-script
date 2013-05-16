({

  baseUrl: "../js/",

  mainConfigFile: '../js/main.js',

  name: 'lib/almond',

  include: ['main'],

  //define mobile specific script output
  out: '../js/min/mobile.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',
    'gpt': 'lib/gpt',

    //define wp site specific script here:
    'siteScript': 'wp_mobile/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    },
    'jqueryUI':{
      deps: ['jquery'],
      exports: '$'
    }
  }

})