/**
 * Extends Universal, page level keyvalues with wp mobile specific keyvalues
 */
define([
  'utils/merge',
  'packages/mobile/keyvalues'
], function(merge, kvs){

  return merge(kvs, {
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