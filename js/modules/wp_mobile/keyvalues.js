/**
 * Extends Universal, page level keyvalues with wp mobile specific keyvalues
 */
(function(define){

  'use strict';

  define([
    'keyvalues/kw',
    'keyvalues/poe'
  ], function(kw, poe){

    return {
      kw: kw,
      poe: poe,
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
    };

  });

})(window.define);