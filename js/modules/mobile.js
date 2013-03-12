/**
 * WP mobile web specific ad script
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define('mobile', ['generic.core', 'json!mobile.config.json', 'utils.core'], function(wpAd, config, utils){
      
      //set the base node
      wpAd.dfpSite = '/701/mob.wp.';
      
      //expose helper functions
      wpAd.utils = utils;
      
      //expose config
      wpAd.config = config;

      return wpAd;
    });
  }

})(window, document, window.define);