define(['jQuery'], function($){

  var utils = {

    /**
     * Appends a css stylesheet to the <head>.
     * @param {String} url A URL to the CSS file.
     */
    addCss: function (url) {
      var l = document.createElement('link');
      l.href = url;
      l.rel = 'stylesheet';
      l.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(l);
    },
    addCSS: function (url) {
      this.addCss(url);
    },
    /**
     * Appends an inline css <style> element to the <head>.
     * Useful for style changes to elements created after $(document).ready();
     * @param {String} a raw CSS string, i.e. "body {background-color: black;}".
     */
    addInlineCss: function (str) {
      var el = document.createElement('style');
      el.type = "text/css";
      el.media = 'screen';
      if(el.styleSheet){
        el.styleSheet.cssText = str;
      } else {
        el.appendChild(document.createTextNode(str));
      }
      return document.getElementsByTagName('head')[0].appendChild(el);
    },
    addInlineCSS: function (str) {
      utils.addInlineCss(str);
    },
    /**
     * Appends a tracking pixel to the <body>.
     * @param {String} url A URL to the tracking pixel.
     */
    addPixel: function (url) {
      var i = document.createElement('img');
      i.src = url.replace(/\[timestamp\]|%n|\[random\]/gi, Math.floor(Math.random() * 1E9));
      i.width = '1';
      i.height = '1';
      i.alt = arguments[1] || '';
      i.style.display = 'none';
      i.style.border = '0';
      document.body.appendChild(i);
    },

    /**
     * AJAX in a script, or if !$, fallback on utils.getScript
     * @param {Object} config Object of $.ajax config settings
     */
    ajax: function(config){
      if(!config.url){return;}
      if($){
        config = $.extend(true, {
          dataType: 'script',
          cache: true,
          crossDomain: true,
          timeout: 4000,
          success: function(){
            if(utils.flags.debug){
              utils.log('AJAX request successful for', config.url);
            }
          },
          error: function(err){
            if(utils.flags.debug){
              utils.log('AJAX error for', config.url, err);
            }
          }
        }, config);
        $.ajax(config);
      } else {
        utils.getScript(config.url, config.success);
      }
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
          temp[key] = this.clone(obj[key]);
        }
      }
      return temp;
    },

    /**
     * Loads debugging script.
     * @param {Array} queue Array of arguments queued up to be passed to placeAd2.
     */
    debug: function(queue){
      utils.ajax({
        url: (/localhost/.test(document.domain) ? '' : 'http://js.washingtonpost.com/wp-srv/ad/loaders/latest/') + 'js/debug.js'
      });
      if(queue){
        utils.log('placeAd2 queue:', queue);
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
      //window.estNowWithYear = d.toString();
      return d.toString();
    })(),

    /**
     * Calls queued up placeAd2 calls (when placeAd2 is redefined).
     * Has checks in here to prevent multiple calls to same ad (eg: data-ad-type and placeAd2 for same ad).
     * @param {Array} queue Array of arguments (Array's or Object's) to pass to each placeAd2 call.
     */
    execPlaceAd2Queue: function(queue){
      if(queue){
        var l = queue.length,
          rendered = {},
          i = 0,
          pos;
        for(i;i<l;i++){
          pos = utils.isObject(queue[i][0]) ? queue[i][0].what : queue[i][1];
          if(pos && !rendered[pos]){
            placeAd2.apply(window, queue[i]);
            rendered[pos] = true;
          }
        }
      }
    },

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
     * Detects and returns the version of Flash Player installed.
     * @return {Number} Version of Flash Player, or 0 if no Flash Player.
     */
    flashver: function(){
      var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
      if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
      else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
      return 0;
    },

    /**
     * Reads a document cookie value.
     * @param {String} name The name of the cookie to read.
     * @return {String|null} The cookie value, or null if the cookie does not exist.
     */
    getCookie: function(name){
      var cookie = '' + document.cookie,
        search = '' + name + '=',
        str = null,
        offset = 0,
        end = 0;
      if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset !== -1) {
          offset += search.length;
          end = cookie.indexOf(';', offset);
          if (end === -1) {
            end = cookie.length;
          }
          str = unescape(cookie.substring(offset, end));
        }
      }
      return str;
    },

    /**
     * Asynchronously append a JavaScript File to the <head>, with optional onload callback.
     * @param {String|Object} url URL to the JavaScript file to be loaded.
     * @param {Function} opt_callback Callback function to execute once the script has loaded.
     */
    getScript: function(src, opt_callback) {
      var s = document.createElement('script'),
        target = document.body || document.getElementsByTagName('head')[0] || false;
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
     * Checks if argument is an Array.
     * @param {Object} atts Object of attributes to be applied to the iframe. Extends defaults.
     * @return {Iframe DOM Element}
     */
    iframeBuilder: function (atts) {
      var i = document.createElement('iframe'),
        key;

      atts = atts || {};

      //defaults
      i.frameBorder = '0';
      i.height = '0';
      i.width = '0';
      i.scrolling = 'no';
      i.marginHeight = '0';
      i.marginWidth = '0';

      for(key in atts) {
        if(atts.hasOwnProperty(key)) {
          i[key] = atts[key];
        }
      }

      return i;
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
     * Loops through an Object of functions, executes them, assigns the [result] to a key (function name
     * by default, override by returning as Object instead of Array).
     * @param {Object} kvs The Object of functions, or Array of functions to iterate through.
     * @param {Object} opt_context The context to call each function in.
     * @return {Object} Object of key/value pairs based on function name : [executed function value]
     */
    keyvalueIterator: function(kvs, opt_context){
      opt_context = opt_context || this;
      var rv = {},
        key, val, k, fnlen;

      //loop through kvs
      for(key in kvs){
        if(kvs.hasOwnProperty(key)){

          //function -> [function] if needed
          if(!utils.isArray(kvs[key])){
            kvs[key] = [kvs[key]];
          }

          fnlen = kvs[key].length;

          //loop through all functions associated with key, and add all results to Array rv[keyvalue Name]
          while(fnlen--){
            val = kvs[key][fnlen].call(opt_context);
            if(val){
              //if return value is object, use returned object's key and result as keyvalue pair
              if(utils.isObject(val)){
                for(k in val){
                  if(val.hasOwnProperty(k)){
                    val[k] = utils.isArray(val[k]) ? val[k] : [val[k]];
                    if(val[k].length && val[k][0] !== false){
                      rv[k] = rv[k] || [];
                      rv[k] = rv[k].concat(val[k]);
                    }
                  }
                }
              //else use the original key (function name)
              } else {
                val = utils.isArray(val) ? val : [val];
                if(val.length && val[0] !== false){
                  rv[key] = rv[key] || [];
                  rv[key] = rv[key].concat(val);
                }
              }
            }
          }
        }
      }
      return rv;
    },

    /**
     * Safety function for console.log. Takes any type/number of arguments, like console.log.
     */
    log: function(){
      if(window.console && typeof window.console.log === 'function'){
        var args = ['--ADOPS DEBUG--'].concat(Array.prototype.slice.call(arguments));
        window.console.log.apply(window.console, args);
      }
    },

    /**
     * Merges and extends an object of arrays into another.
     * @param {Object} originalArrays Object to be extended (the defaults).
     * @param {Object} newArrays Object to be merged into the default Object, extending existing
     *    keys, or creating new ones that didn't previously exist
     * @return {Object} The merged Object containing arrays assigned to keys.
     */
    merge: function(originalArrays, newArrays){
      for(var key in newArrays){
        if(newArrays.hasOwnProperty(key)){
          if(!originalArrays.hasOwnProperty(key)){
            originalArrays[key] = [];
          } else {
            originalArrays[key] = utils.isArray(originalArrays[key]) ? originalArrays[key] : [originalArrays[key]];
          }
          newArrays[key] = utils.isArray(newArrays[key]) ? newArrays[key] : [newArrays[key]];
          originalArrays[key] = originalArrays[key].concat(newArrays[key]);
        }
      }
      return originalArrays;
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
      document.cookie = name + "=" + escape(val) + (opt_expires ? "; expires=" + opt_expires : "") +
        (opt_path ? "; path=" + opt_path : "") + (opt_domain ? "; domain=" + opt_domain : "") +
        (opt_secure ? "; secure" : "");
    },

    /**
     * Assigns keyvalues to a the gpt publisher service, or a gpt ad slot
     * @param {Object} map Key/Value mapping
     * @param {Object} target GPT publisher service, or GPT ad slot
     */
    setTargeting: function(map, target){
      for(var key in map){
        if(map.hasOwnProperty(key)){
          target.setTargeting(key, utils.isArray(map[key]) ? map[key] : [map[key]]);
        }
      }
    },

    /**
     * Transforms the argument to an Array.
     * @param {*} arg Argument to transform to an Array.
     * @return {Array} Returns arg as an Array, or if arg is undefined, empty [].
     */
    toArray: function(arg){
      if(typeof arg === 'undefined'){
        return [];
      }
      return utils.isArray(arg) ? arg : [arg];
    },

    /**
     * Transforms argument to a string, with optional delimeter for Arrays
     * @param {*} arg Value to convert to a String
     * @param {String} opt_delim Optional delimeter for Arrays
     * @return {String|undefined} arg converted to a String, or '' if arg === undefined.
     */
    _toString: function(arg, opt_delim){
      opt_delim = opt_delim || ',';
      return utils.isArray(arg) ? arg.join(opt_delim) : String(arg);
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
      var loc = parent.window.location.href || document.referrer,
        obj = (opt_variable && typeof opt_variable === 'object') ? opt_variable : null,
        regex = (obj !== null && obj.type === 'variable') ? new RegExp("[\\?&;]" + arg + "=([^&#?]*)") : new RegExp(arg),
        results = regex.exec(loc);
      return (results === null) ? null : results[results.length - 1];
    },

    /**
     * Checks each word in an array to see if that word (including variations) exists in a string.
     * @param {Array|String} wordList A list of words to check for.
     * @param {String} str String of words to check against.
     * @param {Boolean} opt_noVariations Set to true to just check exact words, without variations.
     * @return {Boolean} Returns true if a match is found, else returns false.
     */
    wordMatch: function (wordList, str, opt_noVariations) {
      opt_noVariations = opt_noVariations || false;
      wordList = utils.isArray(wordList) ? wordList : [wordList];
      var regex = [],
        variations = opt_noVariations ? '' : '(|s|es|ed|ing|er)',
        l = wordList.length;
      if(l && str){
        while(l--) {
          regex.push(wordList[l] + variations);
        }

        regex = '\\b' + regex.join('\\b|\\b') + '\\b';
        return (new RegExp(regex, 'i').test(str));
      }
      return false;
    },

    /**
     * wp_meta_data Object safety check
     * @type {Object}
     */
    wp_meta_data: window.wp_meta_data || {}

  };



  /**
   * Various flags from query string params, JavaScript vars, cookies, etc., can be stored here
   * @type {Object}
   */
  utils.flags = {
    allAds: (/allads/i.test(location.search)),
    debug: (/debugadcode/i.test(location.search)),
    front: (function(){
      if(utils.wp_meta_data.contentType) {
        return utils.wp_meta_data.contentType[0] === 'front' || utils.wp_meta_data.contentType === 'front';
      }
      if(/^homepage/.test(commercialNode)){
        return true;
      }
      //non-methode pages:
      return window.commercialPageType && window.commercialPageType === 'front' ? true : false;
    })(),
    no_interstitials: (/no_interstitials/i.test(location.search)),
    reload: (/reload\=true/.test(location.search)),
    test_ads: utils.urlCheck('test_ads', {
      type: 'variable'
    }),
    dcnode: utils.urlCheck('dcnode', {
      type: 'variable'
    })
  };

  /**
   * A string of page keywords.
   * @return {String} List of page keyvalues delimited by ","
   */
  utils.keywords = (function () {
    if(utils.wp_meta_data.keywords) {
      return utils.isArray(utils.wp_meta_data.keywords) ? utils.wp_meta_data.keywords.join(",") :
        utils.wp_meta_data.keywords;
    } else {
      //Pages where wp_meta_data.keywords is undefined.. there are plenty:
      var meta = document.getElementsByTagName('meta'),
        l = meta.length,
        content;

      while(l--) {
        if(meta[l].getAttribute('name') === 'keywords') {
          content = meta[l].getAttribute('content');
          if(content){
            return content;
          }
        }
      }
    }
    return '';
  })();

  /**
   * Determines whether this page should get an interstitial, based on every 3rd page (non-front)
   * view via a cookie.
   * @type {Boolean} true to render the interstitial, false to not.
   */
  utils.flags.showInterstitial = (function(){
    if(document.cookie && !utils.flags.no_interstitials){
      var name = document.domain + '_pageview',
        cookieVal = utils.getCookie(name),
        rv = true,
        time = new Date(parseInt(new Date().getTime(), 10) + 432E5).toString();

      if(cookieVal){
        rv = Number(cookieVal)%3 ? false : true;
        utils.setCookie(name, Number(cookieVal) + 1, time, '/');
      } else {
        utils.setCookie(name, '1', time, '/');
      }

      return rv;
    }
    return false;
  })();

  return utils;

});
