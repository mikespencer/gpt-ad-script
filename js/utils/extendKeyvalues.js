(function(){

  'use strict';

  define(['utils/isArray'], function(isArray){

    /**
     * Merges and extends one set of keyvalue functions into another as arrays of functions.
     * @param {Object} kvs Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into the default Object, extending existing
     *    keys, or creating new ones that didn't previously exist
     * @return {Object} The merged Object containing arrays of functions assigned to keys.
     */
    return function(kvs, additions){
      for(var key in additions){
        if(additions.hasOwnProperty(key)){
          if(!kvs.hasOwnProperty(key)){
            kvs[key] = [];
          } else {
            kvs[key] = isArray(kvs[key]) ? kvs[key] : [kvs[key]];
          }
          additions[key] = isArray(additions[key]) ? additions[key] : [additions[key]];
          kvs[key] = kvs[key].concat(additions[key]);
        }
      }
      return kvs;
    };

  });

})();