/**
 * Extended universal code for rendering ads on desktop
 */
(function(w, d, commercialNode, define){

  'use strict';

  if(typeof define === 'function'){
    define('generic', ['generic.core', 'utils'], function(wpAd, utils){

      wpAd.wp_meta_data = w.wp_meta_data || {};

      /**
       * Extend universal desktop page wide keyvalues
       */
      utils.extend(wpAd.GPTConfig.prototype.keyvaluesConfig, {

        page_id: function(){
          if(!wpAd.wp_meta_data.page_id){
            return false;
          }
          var l = wpAd.wp_meta_data.page_id.length;
          while(l--){
            wpAd.wp_meta_data.page_id[l] = wpAd.wp_meta_data.page_id[l].replace(/\./g, '_');
          }
          return wpAd.wp_meta_data.page_id;
        },

        rs: function(){
          var cookie = utils.getCookie('rsi_segs'),
            rv = [],
            i, l;
          if(cookie){
            cookie = cookie.replace(/J05531_/gi, 'j').replace(/D08734_/gi, 'd').split('|');
            l = cookie.length;
            for(i=0;i<l;i++){
              rv.push(cookie[i]);
            }
          }
          return rv;
        }

      });

      return utils.extend(wpAd, {

        cleanScriptTags: function(){
          // Found a call to this on a test page. Adding dummy function to prevent errors until we
          // figure out what to do with this, as it won't be needed when we switch to GPT
        }

      }, true);

    });
  }

})(window, document, window.commercialNode, window.define);