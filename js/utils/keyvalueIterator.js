define(['utils/isArray', 'utils/isObject'], function(isArray, isObject){

 /**
   * Loops through an Object of functions, executes them, assigns the [result] to a key (function name
   * by default, override by returning as Object instead of Array).
   * @param {Object} kvs The Object of functions, or Array of functions to iterate through.
   * @param {Object} opt_context The context to call each function in.
   * @return {Object} Object of key/value pairs based on function name : [executed function value]
   */
  return function(kvs, opt_context){
    opt_context = opt_context || this;
    var rv = {},
      key, val, k, fnlen;

    //loop through kvs
    for(key in kvs){
      if(kvs.hasOwnProperty(key)){

        //function -> [function] if needed
        if(!isArray(kvs[key])){
          kvs[key] = [kvs[key]];
        }

        fnlen = kvs[key].length;

        //loop through all functions associated with key, and add all results to Array rv[keyvalue Name]
        while(fnlen--){
          val = kvs[key][fnlen].call(opt_context);
          if(val){
            //if return value is object, use returned object's key and result as keyvalue pair
            if(isObject(val)){
              for(k in val){
                if(val.hasOwnProperty(k)){
                  val[k] = isArray(val[k]) ? val[k] : [val[k]];
                  if(val[k].length && val[k][0] !== false){
                    rv[k] = rv[k] || [];
                    rv[k] = rv[k].concat(val[k]);
                  }
                }
              }
            //else use the original key (function name)
            } else {
              val = isArray(val) ? val : [val];
              if(val.length && val[0] !== false){
                rv[key] = rv[key] || [];
                rv[key] = rv[key].concat(val);
              }
            }
          }
        }
      }
    }
    return rv;
  };

});