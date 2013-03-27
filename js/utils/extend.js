(function(){

  'use strict';

  define(['utils/isObject'], function(isObject){

    /**
     * Merges one object into another - *Permanently overwrites the first argument.
     * @param {Object} obj Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into and/or overwrite properties in the default Object.
     * @param {Boolean} deep Do a deep merge if true, as run extend on all Child Objects.
     * @return {Object} The merged Object.
     */
    function extend(obj, additions, deep){
      deep = deep || false;
      for(var key in additions){
        if(additions.hasOwnProperty(key)){
          if(!deep || (!isObject(obj[key]) || !isObject(additions[key]))){
            obj[key] = additions[key];
          } else{
            obj[key] = extend(obj[key], additions[key], true);
          }
        }
      }
      return obj;
    }

    return extend;

  });

})();