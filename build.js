({
  appDir: "./",
  baseUrl: "js/",
  dir: '../gpt-built  ',
  mainConfigFile: 'js/adScript.js',

  modules: [
    {
      name: "wp_mobile/main"
    },
    {
      name: "wp/main"
    }
  ],

  paths: {
    'googletag': 'http://www.googletagservices.com/tag/js/gpt',
    //'googletag': 'lib/gpt',
    'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
    //'jquery': 'lib/jquery',
    'jqueryUI': 'lib/jquery-ui.min'
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