/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(w, d, commercialNode, define){

  'use strict';

  if(typeof define === 'function'){
    define(['generic', 'wp/config', 'wp/overrides', 'utils', 'zoneBuilder'], function(wpAd, config, overrides, utils, zoneBuilder){

      //override commercialNode on wp
      w.commercialNode = zoneBuilder.exec();

      //add wp specific flags
      utils.extend(wpAd.flags, {
        reload: (utils.urlCheck('reload', { type: 'variable' }) === 'true')
      });

      /**
       * Add ad specific, site specific keyvalues here:
       */
      utils.extend(wpAd.Ad.prototype.keyvaluesConfig, {

      });

      /**
       * Add global, site specific keyvalues here:
       */
      utils.extend(wpAd.GPTConfig.prototype.keyvaluesConfig, {

        article: function(){
          return ['wp_article'];
        },

        front: function(){
          return ['true'];
        },

        WPATC: function(){
          return ['wpatc_cookie'];
        }

      });

      //commercialNode base:
      wpAd.dfpSite = '/701/wpni.';

      //pass in config:
      wpAd.config = config;

      //pass in site specific overrides:
      wpAd.overrides = overrides;

      //expose helper functions:
      wpAd.utils = utils;

      //testing
      wpAd.init.push(function(){
        try{w.console.log('loaded and initialising');}catch(e){}
      });

      return wpAd;
    });
  }

})(window, document, window.commercialNode, window.define);