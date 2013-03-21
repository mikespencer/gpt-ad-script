(function(define){

  'use strict';

  define(function(){

    /**
     * Checks if argument is an Object.
     * @param {*} a The data type to check.
     * @return {Boolean} true if argument is Object, false otherwise.
     */
    return function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
    };

  });

})(window.define);