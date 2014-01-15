/**
 *  Template of ad flights and available ad spots on washingtonpost.com (mobile web)
 */
define(['utils', 'wp_mobile/mediavoice'], function(utils, mediavoice){
  return {
    flights: {
      defaults: {
        what: ['b', 'mob_enterprise', 't']
      },
      brandconnect_module_test: {
        what: ['brandconnect_module'],
        test: [function(){
          return !!(/brandconnect/.test(window.location.search));
        }],
        hardcode: function(){
          mediavoice.load();
          return false;
        }
      }
    },
    adTypes: {
      'b': {
        'size': [
          [300,50],
          [320, 50]
        ]
      },
      'brandconnect_module': {
        'size': [
          [1, 8]
        ]
      },
      'fixedBottom': {
        'size': [
          [300,50],
          [320, 50]
        ]
      },
      'mob_bigbox': {
        'size': [
          [300, 250]
        ]
      },
      'mob_enterprise': {
        'size': [
          [300, 250]
        ]
      },
      't': {
        'size': [
          [300,50],
          [320, 50]
        ]
      }
    }
  };
});
