define(function(){

  /**
   * Checks if argument is an Array.
   * @param {*} a The data type to check.
   * @return {Boolean} true if argument is Array, false otherwise.
   */
  return function(a){
    return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Array]';
  };

});