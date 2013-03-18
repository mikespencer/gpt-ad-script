/**
 * Extended universal code for rendering ads on desktop
 */
(function(w, d, commercialNode, define){

  'use strict';

  define(['generic.core', 'utils'], function(wpAd, utils){

    return utils.extend(wpAd, {

      cleanScriptTags: function(){
        // Found a call to this on a test page. Adding dummy function to prevent errors until we
        // figure out what to do with this, as it won't be needed when we switch to GPT
      }

    }, true);

  });

})(window, document, window.commercialNode, window.define);