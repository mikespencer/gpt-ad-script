define(['utils/isArray'], function(isArray){

  /**
   * Merges and extends an object of arrays into another.
   * @param {Object} originalArrays Object to be extended (the defaults).
   * @param {Object} newArrays Object to be merged into the default Object, extending existing
   *    keys, or creating new ones that didn't previously exist
   * @return {Object} The merged Object containing arrays assigned to keys.
   */
  return function(originalArrays, newArrays){
    for(var key in newArrays){
      if(newArrays.hasOwnProperty(key)){
        if(!originalArrays.hasOwnProperty(key)){
          originalArrays[key] = [];
        } else {
          originalArrays[key] = isArray(originalArrays[key]) ? originalArrays[key] : [originalArrays[key]];
        }
        newArrays[key] = isArray(newArrays[key]) ? newArrays[key] : [newArrays[key]];
        originalArrays[key] = originalArrays[key].concat(newArrays[key]);
      }
    }
    return originalArrays;
  };

});