(function(define){

  'use strict';

  define(['utils/isArray'], function(isArray){

    /**
     * Merges and extends one set of keyvalues into another - including arrays of functions.
     * @param {Object} obj Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into and/or overwrite properties in the default Object.
     * @return {Object} The merged Object.
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

})(window.define);