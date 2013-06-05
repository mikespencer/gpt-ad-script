({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define wp specific script output
  out: '../js/min/wp_mobile.min.js',

  preserveLicenseComments: false,

  //for testing/debugging
  //optimize: 'none',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define wp site specific script here:
    'siteScript': 'wp_mobile/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})