/**
 *  Template of ad flights and available ad spots on slate.com (mobile web)
 */
define(function(){
  return {
    flights: {
      defaults: {
        what: ['b', 'fixedBottom', 't', 'mob_bigbox', 'mob_halfpage']
      }
    },
    adTypes: {
      'b': {
        'size': [
          [320, 50]
        ]
      },
      'fixedBottom': {
        'size': [
          [300, 50],
          [320, 50],
          [1, 1]
        ]
      },
      't': {
        'size': [
          [320, 50]
        ]
      },
      'mob_bigbox': {
        'size': [
          [300, 250]
        ]
      },
      'mob_halfpage': {
        'size': [
          [300, 600]
        ]
      }
    }
  };
});