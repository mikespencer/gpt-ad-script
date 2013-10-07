/**
 *  Template of ad flights and available ad spots on slate.com (mobile web)
 */
define(function(){
  return {
    flights: {
      defaults: {
        what: ['b', 'fixedBottom', 't', 'm']
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
      'm': {
        'size': [
          [300, 250]
        ]
      }
    }
  };
});