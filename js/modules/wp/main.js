/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(w, d, commercialNode, define){

  'use strict';

  if(typeof define === 'function'){
    define(['generic', 'wp/config', 'wp/overrides', 'utils', 'zoneBuilder', 'templateBuilder'],
    function(wpAd, config, overrides, utils, zoneBuilder, templateBuilder){

      //override commercialNode on wp
      w.commercialNode = zoneBuilder.exec();

      //add wp specific flags
      utils.extend(wpAd.flags, {
        reload: (utils.urlCheck('reload', { type: 'variable' }) === 'true')
      });

      //Add ad specific, site specific keyvalues here:
      utils.extend(wpAd.Ad.prototype.keyvaluesConfig, {

      });

      //Add global, site specific keyvalues here:
      utils.extend(wpAd.gptConfig.keyvaluesConfig, {

        front: function(){
          if(!wpAd.wp_meta_data.contentType){
            return ['n'];
          }
          return wpAd.wp_meta_data.contentType.toString().toLowerCase() === 'front' ? ['y'] : ['n'];
        },

        WPATC: function(){
          return [false];
        }

      });

      //commercialNode base:
      wpAd.dfpSite = '/701/wpni.';

      //pass in config:
      wpAd.config = config;

      //determine open spots:
      wpAd.flights = templateBuilder.exec(config.flights);

      //pass in site specific overrides:
      wpAd.overrides = overrides;

      //expose helper functions:
      wpAd.utils = utils;

      return wpAd;
    });
  }

})(window, document, window.commercialNode, window.define);