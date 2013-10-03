({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define slate mobile specific script output
  out: '../js/min/slate_mobile.min.js',

  preserveLicenseComments: false,
  //generateSourceMaps: true,

  //for testing/debugging - need to install on server
  //optimize: 'uglify2',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define wp site specific script here:
    'siteScript': 'slate_mobile/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})