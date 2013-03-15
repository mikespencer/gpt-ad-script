/**
 * @fileoverview Extended set of helper functions for ads.
 */
(function(w, d, define){

  'use strict';

  define(['utils.core'], function(utils){

    /**
     * extends basic utils object with more advanced functionality.
     */
    utils = utils.extend(utils, {

      /**
       * Appends a css stylesheet to the <head>.
       * @param {String} url A URL to the CSS file.
       */
      addCSS: function (url) {
        var l = d.createElement('link');
        l.href = url;
        l.rel = 'stylesheet';
        l.type = 'text/css';
        d.getElementsByTagName('head')[0].appendChild(l);
      },

      /**
       * Appends a tracking pixel to the <body>.
       * @param {String} url A URL to the tracking pixel.
       */
      addPixel: function (url) {
        var i = d.createElement('img');
        i.src = url.replace(/\[timestamp\]|%n|\[random\]/gi, Math.floor(Math.random() * 1E9));
        i.width = '1';
        i.height = '1';
        i.alt = arguments[1] || '';
        i.style.display = 'none';
        i.style.border = '0';
        d.body.appendChild(i);
      },

      /**
       * Creates a duplicate Object independent of the original.
       * @param {Object} obj Object to be cloned.
       * @return {Object} Cloned Object.
       */
      clone: function (obj) {
        if(!utils.isObject(obj)) {
          return obj;
        }
        var temp = new obj.constructor(),
          key;
        for(key in obj) {
          if(key !== '') {
            temp[key] = utils.clone(obj[key]);
          }
        }
        return temp;
      },

      /**
       * Detects and returns the version of Flash Player installed.
       * @return {Number} Version of Flash Player, or 0 if no Flash Player.
       */
      flashver: function(){
        var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
        if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
        else if(!!(w.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
        return 0;
      },

      /**
       * Asynchronously append a JavaScript File to the <head>, with optional onload callback.
       * @param {String|Object} url URL to the JavaScript file to be loaded.
       * @param {Function} opt_callback Callback function to execute once the script has loaded.
       */
      getScript: function(src, opt_callback) {
        var s = d.createElement('script'),
          target = d.body || d.getElementsByTagName('head')[0] || false;
        opt_callback = opt_callback || false;
        if(target){
          s.type = 'text/' + (src.type || 'javascript');
          s.src = src.src || src;
          if(typeof opt_callback === 'function'){
            s.onreadystatechange = s.onload = function() {
              var state = s.readyState;
              if (!opt_callback.done && (!state || /loaded|complete/.test(state))) {
                opt_callback.done = true;
                opt_callback();
              }
            };
          }
          target.appendChild(s);
        }
      },

      /**
       * Builds and returns a DOM iframe element.
       * @param {Object} atts Attribute mapping for the iframe that will overwrite defaults.
       * @return {Element} The constructed iframe DOM element.
       */
      iframeBuilder: function (atts) {
        var i = d.createElement('iframe'),
          key;

        atts = atts || {};

        //defaults
        i.frameBorder = "0";
        i.height = "0";
        i.width = "0";
        i.scrolling = "no";
        i.marginHeight = "0";
        i.marginWidth = "0";

        for(key in atts) {
          if(atts.hasOwnProperty(key)) {
            i[key] = atts[key];
          }
        }

        return i;
      }

    });

    return utils;

  });

})(window, document, window.define);