/**
 * Defaults required by all ad scripts
 */
(function(){

  'use strict';

  define(function(require){

    return {

      //stores all ads on the page here
      adsOnPage: {},

      //stores debug info
      debugQueue: [],

      //stores all ads placements on the page that aren't currently open (for debugging).
      adsDisabledOnPage: {},

      //container for array of functions to execute on load
      init: []

    };

  });

})();