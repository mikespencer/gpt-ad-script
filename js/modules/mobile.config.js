/**
 *  Template of ad flights and available ad spots on washingtonpost.com (mobile web)
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define('mobile.config', function(){
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
  }

})(window, document, window.define);