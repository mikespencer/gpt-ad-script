(function(d, define){

  'use strict';

  define(['utils/isArray', 'utils/isObject'], function(isArray, isObject){

   /**
     * Loops through an Object of functions, executes them, assigns the result to a key (function name)
     * as an Array.
     * @param {Object} obj The Object of functions to iterate through.
     * @param {Object} opt_context The context to call each function in.
     * @return {Object} Object of key/value pairs based on function name : [executed function value]
     */
    return function(obj, opt_context){
      opt_context = opt_context || this;
      var rv = {}, key, val, k;
      for(key in obj){
        if(obj.hasOwnProperty(key)){
          val = obj[key].call(opt_context);
          if(val){
            if(isObject(val)){
              for(k in val){
                if(val.hasOwnProperty(k)){
                  val[k] = isArray(val[k]) ? val[k] : [val[k]];
                  if(val[k].length && val[k][0] !== false){
                    rv[k] = val[k];
                  }
                }
              }
            } else {
              val = isArray(val) ? val : [val];
              if(val.length && val[0] !== false){
                rv[key] = val;
              }
            }
          }
        }
      }
      return rv;
    };

  });

})(document, window.define);