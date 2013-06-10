({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define wp specific script output
  out: '../js/min/theroot.min.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define wp site specific script here:
    'siteScript': 'theroot/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})