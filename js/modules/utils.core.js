/**
 * @fileoverview Essential helper functions for ads.
 */
(function(w, d, define){

  'use strict';

  /**
   * Helper functions for core functionality (can be extended in utils module).
   */
  var utils = {

    /**
     * Assigns keyvalues to a the gpt publisher service, or a gpt ad slot
     * @param {Object} map Key/Value mapping
     * @param {Object} target GPT publisher service, or GPT ad slot
     */
    addKeyvalues: function(map, target){
      for(var key in map){
        if(map.hasOwnProperty(key)){
          target.setTargeting(key, utils.isArray(map[key]) ? map[key] : [map[key]]);
        }
      }
    },

    /**
     * estNowWithYear for determining ad flights.
     * @type {String}.
     */
    estNowWithYear: (function () {
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
    })(),

    /**
     * Merges one object into another - *Permanently overwrites the first argument.
     * @param {Object} obj Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into and/or overwrite properties in the default Object.
     * @param {Boolean} deep Do a deep merge if true, as run extend on all Child Objects.
     * @return {Object} The merged Object.
     */
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

    /**
     * Reads a document cookie value.
     * @param {String} name The name of the cookie to read.
     * @return {String|null} The cookie value, or null if the cookie does not exist.
     */
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

    /**
     * Checks if argument is an Array.
     * @param {*} a The data type to check.
     * @return {Boolean} true if argument is Array, false otherwise.
     */
    isArray: function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Array]';
    },

    /**
     * Checks if argument is an Object.
     * @param {*} a The data type to check.
     * @return {Boolean} true if argument is Object, false otherwise.
     */
    isObject: function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
    },

    /**
     * Loops through an Object of functions, executes them, assigns the result to a key (function name)
     * as an Array.
     * @param {Object} obj The Object of functions to iterate through.
     * @param {Object} opt_context The context to call each function in.
     * @return {Object} Object of key/value pairs based on function name : [executed function value]
     */
    keyvalueIterator: function(obj, opt_context){
      opt_context = opt_context || this;
      var rv = {}, key, val;
      for(key in obj){
        if(obj.hasOwnProperty(key)){
          val = obj[key].call(opt_context);
          if(val){
            //lets always make this an array, so that we can push to it later if necessary (overrides)
            val = utils.isArray(val) ? val : [val];
            if(val[0] !== false){
              rv[key] = val;
            }
          }
        }
      }
      return rv;
    },

    /**
     * Sets a document cookie
     * @param {String} name Name of the cookie
     * @param {String} val Value of the cookie
     * @param {String} opt_expires Expires
     * @param {String} opt_path Path
     * @param {String} opt_domain Domain
     * @param {Boolean} opt_secure Secure
     */
    setCookie: function (name, val, opt_expires, opt_path, opt_domain, opt_secure) {
      d.cookie = name + "=" + escape(val) + (opt_expires ? "; expires=" + opt_expires : "") +
        (opt_path ? "; path=" + opt_path : "") + (opt_domain ? "; domain=" + opt_domain : "") +
        (opt_secure ? "; secure" : "");
    },

    /**
     * Checks the URL for a value
     * @param {String} arg Value to check for in the URL
     * @param {Object} opt_variable Object with the format of {type: 'variable'} to return the value
     *    after the = sign of the first argument. EG: 'test=123' would return '123'
     * @return {Boolean|null|String} true for a match, null for no match, or String if opt_variable
     *    and a match.
     */
    urlCheck: function (arg, opt_variable) {
      var loc = parent.window.location.href || d.referrer,
        obj = (opt_variable && typeof opt_variable === 'object') ? opt_variable : null,
        regex = (obj !== null && obj.type === 'variable') ? new RegExp("[\\?&;]" + arg + "=([^&#?]*)") : new RegExp(arg),
        results = regex.exec(loc);
      return (results === null) ? null : results[results.length - 1];
    }

  };

  define(function(){
    return utils;
  });

})(window, document, window.define);