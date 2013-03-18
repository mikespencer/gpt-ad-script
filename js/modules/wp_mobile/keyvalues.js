/**
 * Extends Universal, page level keyvalues with wp mobile specific keyvalues
 */
(function(w, d, define){

  'use strict';

  define(['utils.core', 'keyvalues.core'], function(utils, kvs){

    return utils.extend(kvs, {

      forecast: function(){
        return ['1'];
      },

      csit: function(){
        return ['1'];
      },

      dw: function(){
        return ['1'];
      },

      loc: function(){
        return [''];
      },

      u: function(){
        return [''];
      }

    });

  });

})(window, document, window.define);