(function(){

  'use strict';

  define(['utils/getCookie'], function(getCookie){

    return function(){
      var cookie = getCookie('WPATC'),
        rv = {},
        l, a, key;

      if(cookie) {
        cookie = unescape(cookie).split(':');
        l = cookie.length;
        while(l--) {
          a = cookie[l].split('=');
          if(rv[a[0]]) {
            rv[a[0]].push(a[1]);
          } else {
            rv[a[0]] = [a[1]];
          }
        }
      }

      return rv;
    };

  });

})();