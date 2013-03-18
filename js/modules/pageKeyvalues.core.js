/**
 * Universal Desktop/mobile/sitewide page level keyvalues. These are everywhere
 */
(function(w, d, define){

  'use strict';

  define(['utils.core'], function(utils){

    return {

      kw: function(){
        var param = utils.urlCheck('test_ads', { type: 'variable' });
        return param ? ['test_' + param] : false;
      },

      poe: function(){
        var name = w.location.hostname + '_poe';
        if(utils.getCookie(name)){
          return ['no'];
        } else {
          utils.setCookie(name, 'true', '', '/', '','');
          return ['yes'];
        }
      }

    };

  });

})(window, document, window.define);