(function(d, define){

  'use strict';

  define(['utils/urlCheck'], function(urlCheck){
    return urlCheck('reload', { type: 'variable' }) === 'true';
  });

})(document, window.define);