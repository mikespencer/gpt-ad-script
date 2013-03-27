(function(d, define){

  'use strict';

  define(function(){

    /**
     * Appends a css stylesheet to the <head>.
     * @param {String} url A URL to the CSS file.
     */
    return function (url) {
      var l = d.createElement('link');
      l.href = url;
      l.rel = 'stylesheet';
      l.type = 'text/css';
      d.getElementsByTagName('head')[0].appendChild(l);
    };

  });

})(document, window.define);