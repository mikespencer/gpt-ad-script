({

  baseUrl: "../js/modules",

  name: '../lib/almond',

  include: ['main'],

  //define theroot mobile specific script output
  out: '../js/min/theroot_mobile.min.js',

  preserveLicenseComments: false,
  //generateSourceMaps: true,

  //for testing/debugging - need to install on server
  //optimize: 'uglify2',

  wrap: true,

  paths: {
    'gpt': '../lib/gpt',

    //define theroot site specific script here:
    'siteScript': 'theroot_mobile/main'
  },

  shim: {
    'gpt': {
      exports: 'googletag'
    }
  }

})
