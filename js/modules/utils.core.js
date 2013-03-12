/**
 * Essential helper functions for ads
 */
(function(w, d, define){

  'use strict';

  /**
   * Get and store estNowWithYear. Also expose to window for legacy scripts
   */
  var estNowWithYear = (function () {
    var a = new Date(),
      e = a.getTime(),
      t = a.getDate(),
      // z = get date of the first sunday in the current month.
      z = (a.getDate() - a.getDay()) % 7,
      // s = if the current date is or before the first sunday of the current month, then the result will be 7 less than . This check returns the correct date of the first sunday of this month.
      s = (z <= 0) ? z + 7 : z,
      n = a.getMonth() + 1,
      m = (a.getTimezoneOffset() - ((n < 3 || n > 11) ? 300 : (n > 3 && n < 11) ? 240 : (n === 3) ? (t > (s + 7) || (t === (s + 7) && a.getHours() >= 2)) ? 240 : 300 : (t > s || (t === s && a.getHours() >= 2)) ? 300 : 240)) * 60000,
      b = new Date(e + m),
      d = '' + ((b.getYear() < 1900) ? b.getYear() + 1900 : b.getYear()) + (((b.getMonth() + 1) < 10) ? "0" + (b.getMonth() + 1) : (b.getMonth() + 1)) + ((b.getDate() < 10) ? "0" + b.getDate() : b.getDate()) + ((b.getHours() < 10) ? "0" + b.getHours() : b.getHours()) + ((b.getMinutes() < 10) ? "0" + b.getMinutes() : b.getMinutes());
    w.estNowWithYear = d.toString();
    return w.estNowWithYear;
  })();


  /**
   * Helper functions for core functionality (extend in generic.full)
   */
  var utils = {

    estNowWithYear: estNowWithYear,

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