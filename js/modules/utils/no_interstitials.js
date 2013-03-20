(function(d, define){

  'use strict';

  define(function(){
    return (/no_interstitials/.test(location.search));
  });

})(document, window.define);