/**
 * Core universal code for rendering ads accross sites/platforms
 * Should include minimal functionality to fully support mobile web
 */
(function(w, d, define){

  'use strict';

  define(['Ad', 'gptConfig', 'templateBuilder'], function(Ad, gptConfig, templateBuilder){

    return {

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig,

      //stores all ads on the page here
      adsOnPage: {},

      //container for array of functions to execute on load
      init: [],

      templateBuilder: templateBuilder,

      //platform/site universal flags
      flags: {
        debug: /debugadcode/i.test(location.search),
        allAds: /allAds/.test(location.search)
      }
    };

  });

})(window, document, window.define);
