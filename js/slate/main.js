/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(define){

  'use strict';

  define([

    'defaultSettings',
    'Ad',
    'gptConfig',
    'utils/templateBuilder',
    'utils/extend',
    'utils/merge',
    'utils/front',
    'utils/showInterstitial',
    'utils/flags',
    'slate/config',
    'slate/keyvalues',
    'slate/overrides'

  ], function(

    defaultSettings,
    Ad,
    gptConfig,
    templateBuilder,
    extend,
    merge,
    front,
    showInterstitial,
    flags,
    config,
    kvs,
    overrides

  ){

    //extend or add keyvalues at the ad level
    //each key can accept a function, or an array of functions
    merge(Ad.prototype.keyvaluesConfig, {

      //none at the moment

    });

    //add page specific keyvalues
    merge(gptConfig.keyvaluesConfig, kvs);

    //Custom flight templates that require additional conditionals
    config.flights = extend({
      interstitial: {
        what: ['interstitial'],
        test: [showInterstitial && !front]
      }
    }, config.flights);

    return extend(defaultSettings, {

      constants: {
        dfpSite: '/701/slate.',
        domain: 'slate.com'
      },

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig.init({
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