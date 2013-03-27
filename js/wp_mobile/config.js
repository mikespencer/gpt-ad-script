/**
 *  Template of ad flights and available ad spots on washingtonpost.com (mobile web)
 */
(function(define){

  'use strict';

  define(function(){
    return {
      flights: {
        defaults: {
          what: ['t', 'b']
        }
      },
      adTypes: {
        't': { 'size': [[300,50], [320, 50], [1,1]] },
        'b': { 'size': [[300,50], [320, 50], [1,1]] }
      }
    };
  });

})(window.define);