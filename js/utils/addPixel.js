(function(d, define){

  'use strict';

  define(function(){

    /**
     * Appends a tracking pixel to the <body>.
     * @param {String} url A URL to the tracking pixel.
     */
    return function (url) {
      var i = d.createElement('img');
      i.src = url.replace(/\[timestamp\]|%n|\[random\]/gi, Math.floor(Math.random() * 1E9));
      i.width = '1';
      i.height = '1';
      i.alt = arguments[1] || '';
      i.style.display = 'none';
      i.style.border = '0';
      d.body.appendChild(i);
    };

  });

})(document, window.define);