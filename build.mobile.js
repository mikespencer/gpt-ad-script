({
  baseUrl: "js/",
  mainConfigFile: 'js/adScript.js',

  name: 'almond',
  include: 'adScript',
  out: 'js/adScript-mobile.js',
  //excludeShallow: 'debug',
  //wrap: true,

  namespace: "adsRequire",

  // maybe can solve the conditional site script loading problem here... have a different build file for
  // each site and mobile with "siteScript" defined as that site specific script... then just ['siteScript']
  // dep in adScript..
  paths: {
    //'googletag': 'http://www.googletagservices.com/tag/js/gpt',
    'googletag': 'lib/gpt',
    'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
    //'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min',

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