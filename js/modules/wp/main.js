/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(define){

  'use strict';

  define([
    'Ad',
    'gptConfig',
    'utils/zoneBuilder',
    'utils/templateBuilder',
    'utils/extend',
    'utils/front',
    'utils/flags',
    'wp/config',
    'wp/keyvalues',
    'wp/overrides'
  ], function(Ad, gptConfig, zoneBuilder, templateBuilder, extend, front, flags, config, kvs, overrides){

    //build commercialNode
    commercialNode = zoneBuilder.exec();

    //Extend keyvalues on an individual ad level
    extend(Ad.prototype.keyvaluesConfig, {
      ad: function(){
        if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
          return config.adTypes[this.config.what].keyvalues.ad;
        }
      }
    });

    //Custom flight templates that require additional conditionals
    config.flights = extend({
      interstitial: {
        what: ['interstitial'],
        test: [!front && !flags.no_interstitials]
      }
    }, config.flights);

    //add page specific keyvalues
    extend(gptConfig.keyvaluesConfig, kvs);

    return {

      //network id
      dfpSite: '/701/wpni.',

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

      flags: flags,

      config: config,

      //determine open ad spots
      flights: templateBuilder.exec(config.flights),

      //overrides
      overrides: overrides,

      cleanScriptTags: function(){
        // Found a call to this on a test page. Adding dummy function to prevent errors until we
        // figure out what to do with this, as it won't be needed when we switch to GPT
      }

    };
  });

})(window.define);