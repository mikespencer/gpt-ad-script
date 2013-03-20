(function(w, define){

  'use strict';

  define([
    'utils/setCookie',
    'utils/getCookie'
  ], function(setCookie, getCookie){

    return function(){
      var name = w.location.hostname + '_poe';
      if(getCookie(name)){
        return ['no'];
      } else {
        setCookie(name, 'true', '', '/', '','');
        return ['yes'];
      }
    };

  });

})(window, window.define);