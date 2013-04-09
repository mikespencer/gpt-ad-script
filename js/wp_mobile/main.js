/**
 * WP mobile web specific ad script
 */
(function(){

  'use strict';

  define([
    'defaultSettings',
    'Ad',
    'gptConfig',
    'wp_mobile/config',
    'wp_mobile/keyvalues',
    'utils/extend',
    'utils/extendKeyvalues',
    'utils/flags'
  ], function(defaultSettings, Ad, gptConfig, config, kvs, extend, extendKeyvalues, flags){

    //add page specific keyvalues
    extendKeyvalues(gptConfig.keyvaluesConfig, kvs);

    //add mobile specific, ad level keyvalues
    /*extendKeyvalues(Ad.prototype.keyvaluesConfig, {

    });*/

    return extend(defaultSettings, {

      //set network id
      constants: {
        dfpSite: '/701/mob.wp.',
        domain: 'mob.wp'
      },

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig.init({
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

})();