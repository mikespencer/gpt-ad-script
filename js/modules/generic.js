/**
 *  Extended universal code for rendering ads on desktop
 */
(function(w, d, commercialNode, define){

  'use strict';

  if(typeof define === 'function'){
    define('generic', ['generic.core', 'utils', 'estNowWithYear'], function(wpAd, utils, estNowWithYear){

      return utils.extend(wpAd, {
        cleanScriptTags: function(){
          // Found a call to this on a test page. Adding dummy function to prevent errors until we
          // figure out what to do with this, as it won't be needed when we switch to GPT
        },
        estNowWithYear: estNowWithYear
      }, true);

    });
  }

})(window, document, window.commercialNode, window.define);