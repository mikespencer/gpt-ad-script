/**
 * Provides core functionality for overrides
 */
define(function(){

  return {

    /**
     * Takes an Ad object (initially defined in Ad.js), modifies it with any specific overrides, then returns it
     */
    exec: function(ad) {
      var key, check, r;
      for(key in this.checks){
        /*if(this.checks.hasOwnProperty(key) && ad.config[key]){
          //old way - loop through each and perform regex check
          //not the most efficient, but may be the easiest and most robust
          //lets see which method works best later down the line
          for(check in this.checks[key]){
            if(this.checks[key].hasOwnProperty(check)){
              r = new RegExp(check, 'i');
              if(r.test(ad.config[key])){
                this.checks[key][check].call(ad);
              }
            }
          }
        }*/
        if(this.checks.hasOwnProperty(key) && ad.config[key] && this.checks[key][ad.config[key]]){
          this.checks[key][ad.config[key]].call(ad);
        }
      }
      return ad;
    },

    /**
     * Placeholder. Define the checks in site specific overrides script
     */
    checks: {}

  };

});