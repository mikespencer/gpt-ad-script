(function(d, define){

  'use strict';

  define(['utils/isObject'], function(isObject){

    /**
     * Creates a duplicate Object independent of the original.
     * @param {Object} obj Object to be cloned.
     * @return {Object} Cloned Object.
     */
    function clone(obj) {
      if(!isObject(obj)) {
        return obj;
      }
      var temp = new obj.constructor(),
        key;
      for(key in obj) {
        if(key !== '') {
          temp[key] = clone(obj[key]);
        }
      }
      return temp;
    }

    return clone;

  });

})(document, window.define);