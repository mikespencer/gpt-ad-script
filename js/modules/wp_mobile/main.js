/**
 * WP mobile web specific ad script
 */
(function(w, d, define){

  'use strict';

  define([
    'Ad',
    'gptConfig',
    'wp_mobile/config',
    'wp_mobile/keyvalues',
    'utils/extend',
    'utils/flags'
  ], function(Ad, gptConfig, config, kvs, extend, flags){

    //add page specific keyvalues
    extend(gptConfig.keyvaluesConfig, kvs);

    //Extend ad specific keyvalues here:
    extend(Ad.prototype.keyvaluesConfig, {

    });

    return {

      //set network id
      dfpSite: '/701/mob.wp.',

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig,

      //stores all ads on the page here
      adsOnPage: {},

      //stores all ads placements on the page that aren't currently open (for debugging).
      adsDisabledOnPage: {},

      //container for array of functions to execute on load
      init: [],

      config: config,

      flights: {
        t: {
          id: 'default'
        }
      },

      flags: flags

    };

  });

})(window, document, window.define);