/**
 * Provides core functionality for overrides
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define('overrides.core', function(){

      var overrides = {

        /**
         *  Takes an Ad object (from generic.js), modifies it with any specific overrides, then returns it
         */
        exec: function(ad) {
          var key, check, r;
          for(key in overrides.checks){
            if(overrides.checks.hasOwnProperty(key) && ad.config[key]){
              for(check in overrides.checks[key]){
                if(overrides.checks[key].hasOwnProperty(check)){
                  r = new RegExp(check, 'i');
                  if(r.test(ad.config[key])){
                    overrides.checks[key][check].call(ad);
                  }
                }
              }
            }
          }
          //old way - no regex, but probably faster..
          /*for(var key in overrides.checks){
            if(overrides.checks.hasOwnProperty(key) && ad.config[key] && overrides.checks[key][ad.config[key]]){
              overrides.checks[key][ad.config[key]].call(ad);
            }
          }*/
          return ad;
        }
      };
      return overrides;

    });
  }

})(window, document, window.define);


