(function(define){

  'use strict';

  define(function(){
    return (/no_interstitials/.test(location.search));
  });

})(window.define);