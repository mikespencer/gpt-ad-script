(function(d, define){

  'use strict';

  define(function(){
    return (/debugadcode/i.test(location.search));
  });

})(document, window.define);