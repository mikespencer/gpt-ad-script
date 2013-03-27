(function(){

  'use strict';

  define(['utils/front'], function(front){

    return function(){
      return front ? ['y'] : ['n'];
    };

  });

})();