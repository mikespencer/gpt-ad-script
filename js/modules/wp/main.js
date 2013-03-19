/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(w, d, commercialNode, define){

  'use strict';

  if(typeof define === 'function'){
    define(['generic.desktop', 'wp/config', 'wp/keyvalues', 'wp/overrides', 'utils', 'zoneBuilder', 'templateBuilder'],
    function(wpAd, config, kvs, overrides, utils, zoneBuilder, templateBuilder){

      //override commercialNode on wp
      w.commercialNode = zoneBuilder.exec();

      //add wp specific flags
      utils.extend(wpAd.flags, {
        reload: (utils.urlCheck('reload', { type: 'variable' }) === 'true')
      });

      //Extend ad specific keyvalues here:
      utils.extend(wpAd.Ad.prototype.keyvaluesConfig, {
        ad: function(){
          if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
            return config.adTypes[this.config.what].keyvalues.ad;
          }
        }
      });

      //add page specific keyvalues
      utils.extend(wpAd.gptConfig.keyvaluesConfig, kvs);

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