/**
 * Essential helper functions for ads
 */
(function(w, d, define){

  'use strict';

  /**
   * Helper functions for core functionality (extend in generic.full)
   */
  var utils = {

    urlCheck: function (arg) {
      var loc = parent.window.location.href || d.referrer,
        obj = (arguments[1] && typeof arguments[1] === 'object') ? arguments[1] : null,
        regex = (obj !== null && obj.type === 'variable') ? new RegExp("[\\?&;]" + arg + "=([^&#?]*)") : new RegExp(arg),
        results = regex.exec(loc);
      return (results === null) ? null : results[results.length - 1];
    },

    extend: function(obj, additions, deep){
      deep = deep || false;
      for(var key in additions){
        if(additions.hasOwnProperty(key)){
          if(!deep || (!utils.isObject(obj[key]) || !utils.isObject(additions[key]))){
            obj[key] = additions[key];
          } else{
            obj[key] = utils.extend(obj[key], additions[key], true);
          }
        }
      }
      return obj;
    },

    getCookie: function (name) {
      var cookie = '' + d.cookie,
        search = '' + name + '=',
        str = null,
        offset = 0,
        end = 0;
      if(cookie.length > 0) {
        offset = cookie.indexOf(search);
        if(offset !== -1) {
          offset += search.length;
          end = cookie.indexOf(';', offset);
          if(end === -1) {
            end = cookie.length;
          }
          str = unescape(cookie.substring(offset, end));
        }
      }
      return(str);
    },

    keyvalueIterator: function(obj, context){
      context = context || this;
      var rv = {}, key, val;
      for(key in obj){
        if(obj.hasOwnProperty(key)){
          val = obj[key].call(context);
          if(val){
            //lets always make this an array, so that we can push to it later if necessary (overrides)
            rv[key] = utils.isArray(val) ? val : [val];
          }
        }
      }
      return rv;
    },

    isObject: function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
    },

    isArray: function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Array]';
    },

    setCookie: function (name, val, expires, path, domain, secure) {
      d.cookie = name + "=" + escape(val) + (expires ? "; expires=" + expires : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
    }

  };

  if(typeof define === 'function'){
    define('utils.core', function(){
      return utils;
    });
  }

})(window, document, window.define);