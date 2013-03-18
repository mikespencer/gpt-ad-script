/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
(function(w, d, define){

  'use strict';

  define(['pageKeyvalues.desktop', 'utils.core', 'wp_meta_data'], function(keyvalues, utils, wp_meta_data){

    //Add wp page specific keyvalues here:
    return utils.extend(keyvalues, {

      front: function(){
        if(!wp_meta_data.contentType){
          return ['n'];
        }
        return wp_meta_data.contentType.toString().toLowerCase() === 'front' ? ['y'] : ['n'];
      },

      WPATC: function(){
        return [false];
      }

    });

  });

})(window, document, window.define);