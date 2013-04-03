/**
 * Extends Universal, page level keyvalues with wp mobile specific keyvalues
 */
(function(){

  'use strict';

  define([
    'utils/extendKeyvalues',
    'packages/mobile/keyvalues'
  ], function(extendKeyvalues, kvs){

    return extendKeyvalues(kvs, {
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

})();