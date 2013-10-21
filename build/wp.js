({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define wp specific script output
  out: '../js/min/wp.min.js',

  preserveLicenseComments: false,
  //generateSourceMaps: true,

  //for testing/debugging - need to install on server
  //optimize: 'uglify2',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define wp site specific script here:
    'siteScript': 'wp/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})
