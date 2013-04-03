/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(define){

  'use strict';

  define([

    'defaultSettings',
    'googletag',
    'Ad',
    'gptConfig',
    'utils/templateBuilder',
    'utils/extend',
    'utils/extendKeyvalues',
    'utils/front',
    'utils/showInterstitial',
    'utils/flags',
    'slate/config',
    'slate/keyvalues',
    'slate/overrides'

  ], function(

    defaultSettings,
    googletag,
    Ad,
    gptConfig,
    templateBuilder,
    extend,
    extendKeyvalues,
    front,
    showInterstitial,
    flags,
    config,
    kvs,
    overrides

  ){

    //extend or add keyvalues at the ad level
    //each key can accept a function, or an array of functions
    extendKeyvalues(Ad.prototype.keyvaluesConfig, {
      //none at the moment
    });

    //add page specific keyvalues
    extendKeyvalues(gptConfig.keyvaluesConfig, kvs);

    //Custom flight templates that require additional conditionals
    config.flights = extend({
      interstitial: {
        what: ['interstitial'],
        test: [showInterstitial && !front]
      }
    }, config.flights);

    return extend(defaultSettings, {

      //network id
      dfpSite: '/701/slate.',

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig.init({
        googletag: googletag,
        sra: true
      }),

      flags: flags,

      config: config,

      //determine open ad spots
      flights: templateBuilder.exec(config.flights),

      //overrides
      overrides: overrides

    });
  });

})(window.define);