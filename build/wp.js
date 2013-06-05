({

  baseUrl: "../js/",

  name: 'lib/almond',

  include: ['modules/main'],

  //define wp specific script output
  out: '../js/min/wp.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',
    'gpt': 'lib/gpt',

    //define wp site specific script here:
    'siteScript': 'modules/wp/main'
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