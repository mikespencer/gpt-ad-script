/**
 * Universal Desktop/sitewide page level keyvalues. These are everywhere on desktop
 */
(function(w, d, define){

  'use strict';

  define(['utils.core', 'pageKeyvalues.core', 'wp_meta_data'], function(utils, pageKeyvalues, wp_meta_data){

    return utils.extend(pageKeyvalues, {

      page_id: function(){
        if(!wp_meta_data.page_id){
          return false;
        }
        var l = wp_meta_data.page_id.length;
        while(l--){
          wp_meta_data.page_id[l] = wp_meta_data.page_id[l].replace(/\./g, '_');
        }
        return wp_meta_data.page_id;
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

  });

})(window, document, window.define);