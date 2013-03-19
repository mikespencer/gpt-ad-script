/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
(function(w, d, define){

  'use strict';

  define(['keyvalues.desktop', 'utils.core', 'wp_meta_data'], function(kvs, utils, wp_meta_data){

    //Add wp page specific keyvalues here:
    return utils.extend(kvs, {

      WPATC: function(){
        return [false];
      }

    });

  });

})(window, document, window.define);