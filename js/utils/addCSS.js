(function(){

  'use strict';

  define(function(){

    /**
     * Appends a css stylesheet to the <head>.
     * @param {String} url A URL to the CSS file.
     */
    return function (url) {
      var l = document.createElement('link');
      l.href = url;
      l.rel = 'stylesheet';
      l.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(l);
    };

  });

})();