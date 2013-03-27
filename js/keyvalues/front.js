(function(define){

  'use strict';

  define(['utils/front'], function(front){

    return function(){
      return front ? ['y'] : ['n'];
    };

  });

})(window.define);