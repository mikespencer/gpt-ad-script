/**
 * Core universal code for rendering ads accross sites/platforms
 * Should include minimal functionality to fully support mobile web
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define(['Ad', 'GPTConfig'], function(Ad, GPTConfig){

      return {
        //utils: utils,
        Ad: Ad,
        GPTConfig: GPTConfig,
        template: {},
        init: [],
        flags: {
          debug: /debugadcode/i.test(location.search),
          allAds: /allAds/.test(location.search),
          no_ads: /no_ads/.test(location.search)
        }
      };

    });
  }

})(window, document, window.define);
