(function(define){

  'use strict';

  define([
    'keyvalues/kw',
    'keyvalues/poe'
  ], function(kw, poe){

    /**
     * Each key can take either a function, or an Array of functions that can assign multiple values
     * to that particular key.
     */
    return {
      kw: [kw],
      poe: [poe]
    };

  });

})(window.define);