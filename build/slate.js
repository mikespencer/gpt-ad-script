({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define slate specific script output
  out: '../js/min/slate.min.js',

  preserveLicenseComments: false,
  //generateSourceMaps: true,

  //for testing/debugging - need to install on server
  optimize: 'uglify2',
  //optimize: 'none',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define slate site specific script here:
    'siteScript': 'slate/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})
