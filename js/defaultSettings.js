/**
 * Defaults required by all ad scripts
 */
(function(define){

  'use strict';

  define(function(){

    return {

      //stores all ads on the page here
      adsOnPage: {},

      //stores all ads placements on the page that aren't currently open (for debugging).
      adsDisabledOnPage: {},

      //container for array of functions to execute on load
      init: []

    };

  });

})(window.define);