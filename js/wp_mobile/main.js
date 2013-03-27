/**
 * WP mobile web specific ad script
 */
(function(define){

  'use strict';

  define([
    'defaultSettings',
    'Ad',
    'googletag',
    'gptConfig',
    'wp_mobile/config',
    'wp_mobile/keyvalues',
    'utils/extend',
    'utils/extendKeyvalues',
    'utils/flags'
  ], function(defaultSettings, Ad, googletag, gptConfig, config, kvs, extend, extendKeyvalues, flags){

    //add page specific keyvalues
    extendKeyvalues(gptConfig.keyvaluesConfig, kvs);

    //add mobile specific, ad level keyvalues
    /*extendKeyvalues(Ad.prototype.keyvaluesConfig, {

    });*/

    return extend(defaultSettings, {

      //set network id
      dfpSite: '/701/mob.wp.',

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig.init({
        googletag: googletag,
        sra: true
      }),

      config: config,

      flights: {
        t: {
          id: 'default'
        }
      },

      flags: flags

    });

  });

})(window.define);