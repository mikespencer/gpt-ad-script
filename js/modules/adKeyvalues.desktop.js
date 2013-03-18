/**
 * NOT USED
 */
(function(w, d, define){

  'use strict';

  define(['adKeyvalues.core', 'utils.core'], function(kvs, utils){

    return utils.extend(kvs, {

      desktop: function(){ return [true]; }

    });

  });

})(window, document, window.define);