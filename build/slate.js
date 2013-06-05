({

  baseUrl: "../js/",

  mainConfigFile: '../js/modules/main.js',

  name: 'lib/almond',

  include: ['modules/main'],

  //define wp specific script output
  out: '../js/min/slate.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',
    'gpt': 'lib/gpt',

    //define wp site specific script here:
    'siteScript': 'modules/slate/main'
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