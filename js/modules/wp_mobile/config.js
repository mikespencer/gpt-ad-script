/**
 *  Template of ad flights and available ad spots on washingtonpost.com (mobile web)
 */
define(function(){
  return {
    flights: {
      defaults: {
        what: ['b', 'mob_enterprise', 't']
      },
      fixedBottom: {
        what: ['fixedBottom'],
        test: function(){
          //render only if device is in portrait orientation
          return window.innerHeight > window.innerWidth;
        }
      }
    },
    adTypes: {
      'b': {
        'size': [
          [300,50],
          [320, 50],
          [1,1]
        ]
      },
      'fixedBottom': {
        'size': [
          [300,50],
          [320, 50],
          [1,1]
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
          [320, 50],
          [1,1]
        ]
      }
    }
  };
});
