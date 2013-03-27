(function(d, define){

  'use strict';

  define(function(){

    /**
     * Asynchronously append a JavaScript File to the <head>, with optional onload callback.
     * @param {String|Object} url URL to the JavaScript file to be loaded.
     * @param {Function} opt_callback Callback function to execute once the script has loaded.
     */
    return function(src, opt_callback) {
      var s = d.createElement('script'),
        target = d.body || d.getElementsByTagName('head')[0] || false;
      opt_callback = opt_callback || false;
      if(target){
        s.type = 'text/' + (src.type || 'javascript');
        s.src = src.src || src;
        if(typeof opt_callback === 'function'){
          s.onreadystatechange = s.onload = function() {
            var state = s.readyState;
            if (!opt_callback.done && (!state || /loaded|complete/.test(state))) {
              opt_callback.done = true;
              opt_callback();
            }
          };
        }
        target.appendChild(s);
      }
    };

  });

})(document, window.define);