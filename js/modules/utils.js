/**
 * Extended set of helper functions for ads
 */
(function(w, d, define){

  'use strict';

  define('utils', ['utils.core'], function(utils){

    /**
     * extend basic utils object with advanced functionality
     */
    utils = utils.extend(utils, {

      addCSS: function (url) {
        var l = d.createElement('link');
        l.href = url;
        l.rel = 'stylesheet';
        l.type = 'text/css';
        d.getElementsByTagName('head')[0].appendChild(l);
      },

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

      flashver: function(){
        var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
        if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
        else if(!!(w.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
        return 0;
      },

      getScript: function(src) {
        var s = d.createElement('script'),
          target = d.body || d.getElementsByTagName('head')[0] || false,
          callback = arguments[1] || false;
        if(target){
          s.type = 'text/' + (src.type || 'javascript');
          s.src = src.src || src;
          if(typeof callback === 'function'){
            s.onreadystatechange = s.onload = function() {
              var state = s.readyState;
              if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
              }
            };
          }
          target.appendChild(s);
        }
      },

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