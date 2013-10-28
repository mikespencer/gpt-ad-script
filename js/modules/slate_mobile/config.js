/**
 *  Template of ad flights and available ad spots on slate.com (mobile web)
 */
define(function(){
  return {
    flights: {
      defaults: {
        what: ['b', 'fixedBottom', 'inline_vid', 'mob_bigbox', 'mob_halfpage', 't']
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
      'inline_vid': {
        'size': [
          [300, 250]
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
      },
      't': {
        'size': [
          [320, 50]
        ]
      }
    }
  };
});
