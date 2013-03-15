/**
 * WP mobile web specific ad script
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define(['generic.core', 'wp_mobile/config', 'utils.core'], function(wpAd, config, utils){

      //set the base node
      wpAd.dfpSite = '/701/mob.wp.';

      //expose helper functions
      wpAd.utils = utils;

      //expose config
      wpAd.config = config;

      //hardcoded template for mobile - no need for templateBuilder at this point:
      wpAd.flights = {
        t: {
          id: 'default'
        }
      };

      return wpAd;
    });
  }

})(window, document, window.define);