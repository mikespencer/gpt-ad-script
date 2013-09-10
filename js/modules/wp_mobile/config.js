/**
 *  Template of ad flights and available ad spots on washingtonpost.com (mobile web)
 */
define(function(){
  return {
    flights: {
      defaults: {
        what: ['b', 'fixedBottom', 't']
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