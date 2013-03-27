(function(){

  'use strict';

  define([
    'utils/flags',
    'utils/getCookie',
    'utils/setCookie'
  ], function(flags, getCookie, setCookie){

    /**
     * Determines whether this page should get an interstitial, based on every 3rd page (non-front)
     * view via a cookie.
     * @type {Boolean} true to render the interstitial, false to not.
     */
    return (function(){
      if(document.cookie && !flags.no_interstitials){
        var name = document.domain + '_pageview',
          cookieVal = getCookie(name),
          rv = true,
          time = new Date(parseInt(new Date().getTime(), 10) + 432E5).toString();

        if(cookieVal){
          rv = Number(cookieVal)%3 ? false : true;
          setCookie(name, Number(cookieVal) + 1, time, '/');
        } else {
          setCookie(name, '1', time, '/');
        }

        return rv;
      }
      return false;
    })();

  });

})();