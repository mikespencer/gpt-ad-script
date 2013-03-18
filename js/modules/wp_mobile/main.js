/**
 * WP mobile web specific ad script
 */
(function(w, d, define){

  'use strict';

  define(['generic.core', 'wp_mobile/config', 'utils.core', 'wp_mobile/pageKeyvalues', 'wp_mobile/adKeyvalues'],
  function(wpAd, config, utils, pageKeyvalues, adKeyvalues){

    //set the base node
    wpAd.dfpSite = '/701/mob.wp.';

    //expose helper functions
    wpAd.utils = utils;

    //add page specific keyvalues
    utils.extend(wpAd.gptConfig.keyvaluesConfig, pageKeyvalues);

    //Extend ad specific keyvalues here:
    utils.extend(wpAd.Ad.prototype.keyvaluesConfig, adKeyvalues);

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

})(window, document, window.define);