
var wpAdRequire;(function () { if (typeof wpAdRequire === 'undefined') {
wpAdRequire = {};
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

wpAdRequire.requirejs = requirejs;wpAdRequire.require = require;wpAdRequire.define = define;
}
}());
wpAdRequire.define("lib/almond", function(){});

/**
 * Defaults required by all ad scripts
 */
(function(){

  

  wpAdRequire.define('defaultSettings',[],function(){

    return {

      //stores all ads on the page here
      adsOnPage: {},

      //stores debug info
      debugQueue: [],

      //stores all ads placements on the page that aren't currently open (for debugging).
      adsDisabledOnPage: {},

      //container for array of functions to execute on load
      init: []

    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/isObject',[],function(){

    /**
     * Checks if argument is an Object.
     * @param {*} a The data type to check.
     * @return {Boolean} true if argument is Object, false otherwise.
     */
    return function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/extend',['utils/isObject'], function(isObject){

    /**
     * Merges one object into another - *Permanently overwrites the first argument.
     * @param {Object} obj Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into and/or overwrite properties in the default Object.
     * @param {Boolean} deep Do a deep merge if true, as run extend on all Child Objects.
     * @return {Object} The merged Object.
     */
    function extend(obj, additions, deep){
      deep = deep || false;
      for(var key in additions){
        if(additions.hasOwnProperty(key)){
          if(!deep || (!isObject(obj[key]) || !isObject(additions[key]))){
            obj[key] = additions[key];
          } else{
            obj[key] = extend(obj[key], additions[key], true);
          }
        }
      }
      return obj;
    }

    return extend;

  });

})();
(function(){

  

  wpAdRequire.define('utils/isArray',[],function(){

    /**
     * Checks if argument is an Array.
     * @param {*} a The data type to check.
     * @return {Boolean} true if argument is Array, false otherwise.
     */
    return function(a){
      return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Array]';
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/extendKeyvalues',['utils/isArray'], function(isArray){

    /**
     * Merges and extends one set of keyvalue functions into another as arrays of functions.
     * @param {Object} kvs Object to be extended (the defaults).
     * @param {Object} additions Object to be merged into the default Object, extending existing
     *    keys, or creating new ones that didn't previously exist
     * @return {Object} The merged Object containing arrays of functions assigned to keys.
     */
    return function(kvs, additions){
      for(var key in additions){
        if(additions.hasOwnProperty(key)){
          if(!kvs.hasOwnProperty(key)){
            kvs[key] = [];
          } else {
            kvs[key] = isArray(kvs[key]) ? kvs[key] : [kvs[key]];
          }
          additions[key] = isArray(additions[key]) ? additions[key] : [additions[key]];
          kvs[key] = kvs[key].concat(additions[key]);
        }
      }
      return kvs;
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/keyvalueIterator',['utils/isArray', 'utils/isObject'], function(isArray, isObject){

   /**
     * Loops through an Object of functions, executes them, assigns the [result] to a key (function name
     * by default, override by returning as Object instead of Array).
     * @param {Object} kvs The Object of functions, or Array of functions to iterate through.
     * @param {Object} opt_context The context to call each function in.
     * @return {Object} Object of key/value pairs based on function name : [executed function value]
     */
    return function(kvs, opt_context){
      opt_context = opt_context || this;
      var rv = {},
        key, val, k, fnlen;

      //loop through kvs
      for(key in kvs){
        if(kvs.hasOwnProperty(key)){

          //function -> [function] if needed
          if(!isArray(kvs[key])){
            kvs[key] = [kvs[key]];
          }

          fnlen = kvs[key].length;

          //loop through all functions associated with key, and add all results to Array rv[keyvalue Name]
          while(fnlen--){
            val = kvs[key][fnlen].call(opt_context);
            if(val){
              //if return value is object, use returned object's key and result as keyvalue pair
              if(isObject(val)){
                for(k in val){
                  if(val.hasOwnProperty(k)){
                    val[k] = isArray(val[k]) ? val[k] : [val[k]];
                    if(val[k].length && val[k][0] !== false){
                      rv[k] = rv[k] || [];
                      rv[k] = rv[k].concat(val[k]);
                    }
                  }
                }
              //else use the original key (function name)
              } else {
                val = isArray(val) ? val : [val];
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
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/addKeyvalues',['utils/isArray'], function(isArray){

    /**
     * Assigns keyvalues to a the gpt publisher service, or a gpt ad slot
     * @param {Object} map Key/Value mapping
     * @param {Object} target GPT publisher service, or GPT ad slot
     */
    return function(map, target){
      for(var key in map){
        if(map.hasOwnProperty(key)){
          target.setTargeting(key, isArray(map[key]) ? map[key] : [map[key]]);
        }
      }
    };

  });

})();
/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
(function(){

  

  wpAdRequire.define('Ad',[
    'utils/extend',
    'utils/extendKeyvalues',
    'utils/isArray',
    'utils/keyvalueIterator',
    'utils/addKeyvalues'
  ], function(extend, extendKeyvalues, isArray, keyvalueIterator, addKeyvalues){

    function Ad(config){
      this.config = extend({
        'dfpSite': '/701/wpni.',
        'where': undefined,
        'size': null,
        'what': null,
        'pos': false,
        'posOverride': false,
        'interstitial': false,
        'onTheFly': false
      }, config, true);

      if(this.config.pos === 'interstitial' && !this.config.interstitial){
        this.config.interstitial = true;
        this.addInterstitialDiv();
      }

      if(!config.hardcode){
        this.keyvalues = this.buildKeyvalues();
      }
    }

    Ad.prototype = {
      constructor: Ad,

      keyvaluesConfig: {
        pos: [
          function(){
            return [this.config.pos];
          }
        ],
        dfpcomp: [
          function(){
            return window.dfpcomp ? [window.dfpcomp] : false;
          }
        ],
        onTheFly: [
          function(){
            var rv = {},
              kvs, kv, len;
            if(this.config.onTheFly){
              kvs = this.config.onTheFly.split(';');
              len = kvs.length;
              while(len--){
                kv = kvs[len].split('=');
                if(kv[0] && kv[1]){
                  rv[kv[0]] = rv[kv[0]] || [];
                  rv[kv[0]].push(kv[1]);
                }
              }
            }
            return rv;
          }
        ]
      },

      getSlug: function(){
        this.config.slug = document.getElementById('slug_' + this.config.pos);
        this.config.wpni_adi = document.getElementById('wpni_adi_' + this.config.pos);
      },

      getContainer: function(){
        return this.config.wpni_adi || this.config.slug;
      },

      buildKeyvalues: function(){
        return keyvalueIterator(this.keyvaluesConfig, this);
      },

      getKeyvalues: function(){
        return this.keyvalues;
      },

      extendKeyvalues: function(obj){
        this.keyvaluesConfig = extendKeyvalues(this.keyvaluesConfig, obj);
      },

      hardcode: function(){
        googletag.content().setContent(this.slot, this.hardcode);
      },

      addInterstitialDiv: function(){
        var s = document.createElement('div');
        s.id = 'slug_' + this.config.pos;
        s.style.display = 'none';
        document.body.insertBefore(s, document.body.firstChild);
      },

      buildGPTSlot: function(){
        this.fullGPTSite = this.config.dfpSite + this.config.where;
        return (!this.config.interstitial ?
          googletag.defineSlot(this.fullGPTSite, this.config.size, this.container.id) :
          googletag.defineOutOfPageSlot(this.fullGPTSite, this.container.id))
            .addService(googletag.pubads());
      },

      getSlot: function(){
        return this.slot;
      },

      slugDisplay: function(){
        var display = arguments[0] !== false ? 'block' : 'none';
        if(this.config.slug){
          this.config.slug.style.display = display;
        }
        if(this.config.wpni_adi){
          this.config.wpni_adi.style.display = display;
        }
      },

      render: function(){
        if(!this.slot){
          this.getSlug();
          this.container = this.getContainer();
          this.slugDisplay(true);
          if(!this.config.hardcode){
            this.slot = this.buildGPTSlot();
            addKeyvalues(this.keyvalues, this.slot);
            googletag.display(this.container.id);
          } else {
            this.container.innerHTML = this.config.hardcode;
          }
        } else {
          this.refresh();
        }
      },

      refresh: function(){
        googletag.pubads().refresh([this.slot]);
      }

    };

    return Ad;

  });

})();
/**
 * this Initial setup
 */
(function(){

  

  wpAdRequire.define('gptConfig',[
    'utils/extend',
    'utils/keyvalueIterator',
    'utils/addKeyvalues'
  ], function(extend, keyvalueIterator, addKeyvalues){

    return {

      exec: function(config){
        this.config = extend({
          async: true,
          sra: true
        }, config);

        this.pubservice = googletag.pubads();

        this.keyvalues = keyvalueIterator(this.keyvaluesConfig, this);
        addKeyvalues(this.keyvalues, this.pubservice);

        if(this.config.sra){
          this.pubservice.enableSingleRequest();
        } else{
          this.pubservice.enableAsyncRendering();
        }

        googletag.enableServices();
      },

      init: function(config){
        var self = this;
        googletag.cmd.push(function(){
          self.exec.call(self, config);
        });
        return this;
      },

      /**
       * Placeholder. Gets added in site script
       */
      keyvaluesConfig: {}

    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/wp_meta_data',[],function(){
    return window.wp_meta_data || {};
  });

})();
(function(){

  

  wpAdRequire.define('utils/contentTypes',[],function(){
    return {
      audiostory: 'audio',
      blogstory: 'blog',
      front: 'front',
      graphicstory: 'graphic',
      mediagallery: 'photo',
      panostory: 'pano',
      ugcphotostory: 'ugc',
      videostory: 'video'
    };
  });

})();
/**
 * Dynamically extends commercialNode
 */
(function(){

  

  wpAdRequire.define('utils/zoneBuilder',['utils/wp_meta_data', 'utils/contentTypes'], function(wp_meta_data, contentTypes){

    commercialNode = window.commercialNode || 'politics';

    return {

      contentType: contentTypes,

      zones: {
        contentType: function(){
          var a = this.getString(wp_meta_data.contentType);
          return a && commercialNode !== 'washingtonpost.com' && this.contentType[a.toLowerCase()] || '';
        },

        contentName: function(){
          return this.getString(wp_meta_data.contentName);
        },

        subsection: function(){
          return this.getString(wp_meta_data.subsection);
        }
      },

      getString: function(a){
        return a ? (typeof a === 'string' ? a : a[0]) : '';
      },

      validate: function(a){
        if(!a){return false;}
        a = a.replace(/\s/g, '').replace(/^\/*|\/*$/g, '').replace(/[^0-9a-zA-Z_\.\-\/]/g, '');
        return (/^[^a-z]/i.test(a) ? 'c' : '') + a;
      },

      exec: function(){
        var zones = this.zones,
          cn = [this.validate(commercialNode)],
          key, t;
        for(key in zones){
          if(zones.hasOwnProperty(key)){
            t = this.validate(zones[key].call(this));
            if(t){
              cn.push(t);
            }
          }
        }
        this.executed = true;
        return cn.join('/').toLowerCase();
      }

    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/urlCheck',[],function(){

    /**
     * Checks the URL for a value
     * @param {String} arg Value to check for in the URL
     * @param {Object} opt_variable Object with the format of {type: 'variable'} to return the value
     *    after the = sign of the first argument. EG: 'test=123' would return '123'
     * @return {Boolean|null|String} true for a match, null for no match, or String if opt_variable
     *    and a match.
     */
    return function (arg, opt_variable) {
      var loc = parent.window.location.href || document.referrer,
        obj = (opt_variable && typeof opt_variable === 'object') ? opt_variable : null,
        regex = (obj !== null && obj.type === 'variable') ? new RegExp("[\\?&;]" + arg + "=([^&#?]*)") : new RegExp(arg),
        results = regex.exec(loc);
      return (results === null) ? null : results[results.length - 1];
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/estNowWithYear',[],function(){

    /**
     * estNowWithYear for determining ad flights.
     * @type {String}.
     */
    return (function () {
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
    })();

  });

})();
/**
 * Checks and builds an ad template of open spots on the current page
 */
(function(){

  

  wpAdRequire.define('utils/templateBuilder',[
    'utils/urlCheck',
    'utils/isArray',
    'utils/estNowWithYear'
  ], function(urlCheck, isArray, estNowWithYear){

    return {

      demoAds: urlCheck('demoAds', {type: 'variable'}),

      exec: function(json){
        if(!this.demoAds){
          this.template = {};
          for(var key in json){
            if(json.hasOwnProperty(key)){
              json[key].id = key;
              if(this.checkFlight(json[key])){
                this.addToTemplate(json[key]);
              }
            }
          }
        } else {
          this.template = this.demoAdsTemplate(this.demoAds);
        }
        return this.template;
      },

      checkFlight: function(template){
        var key;
        for(key in this.checks){
          if(this.checks.hasOwnProperty(key) && template.hasOwnProperty(key)){
            if(!this.checkProperty(key, template[key])){
              return false;
            }
          }
        }
        return true;
      },

      checkProperty: function(prop, val){
        val = isArray(val) ? val : [val];

        var l = val.length,
          i = 0,
          check = false;

        for(i;i<l;i++){
          if(this.checks[prop](val[i])){
            check = true;
          }
        }
        return check;
      },

      addToTemplate: function(template){
        if(template.what){
          var pos = template.what, l = pos.length, i = 0, newPos;
          for(i;i<l;i++){
            if(/^\!/.test(pos[i])){
              newPos = pos[i].split(/\!/)[1];
              if(this.template[newPos]){
                delete this.template[newPos];
              }
            } else {
              this.template[pos[i]] = template;
            }
          }
        }
      },

      demoAdsTemplate: function(adStr){
        var ads = adStr.split(';'),
          l = ads.length,
          rv = {};
        while(l--){
          ads[l] = this.posConverter(ads[l]);
          rv[ads[l]] = { id: 'demoAds' };
        }
        return rv;
      },

      posConverter: function(pos){
        var convert = {
          'ad1': 'leaderboard',
          'ad2': 'leaderboard_2',
          'ad3': 'skyscraper',
          'ad6': 'flex_ss_bb_hp',
          'ad7': 'featurebar',
          'ad14': 'tiffany_tile',
          'ad16': 'flex_bb_hp',
          'ad19': '336x35',
          'ad20': 'bigbox',
          'ad43': 'pushdown',
          'ad44': 'extra_bb',
          'ad45': 'deal'
        };
        return convert.hasOwnProperty(pos) ? convert[pos] : pos;
      },

      //true/false checks:
      checks: {
        test: function(val){
          return typeof val === 'function' ? val() : val;
        },

        where: function(where){
          var open = true;
          if(/^\!/.test(where)){
            open = false;
            where = where.split('!')[1];
          }
          return new RegExp('^' + where).test(commercialNode) ? open : false;
        },

        when: function (when) {
          when = when.split('/');
          return when[0] <= estNowWithYear && when[1] >= estNowWithYear;
        }
      }

    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/front',['utils/wp_meta_data'], function(wp_meta_data){

    return (function(){
      if(wp_meta_data.contentType) {
        return wp_meta_data.contentType[0] === 'front' || wp_meta_data.contentType === 'front';
      }
      if(/^homepage/.test(commercialNode)){
        return true;
      }
      //non-methode pages:
      return window.commercialPageType && window.commercialPageType === 'front' ? true : false;
    })();

  });

})();
(function(){

  

  wpAdRequire.define('utils/allAds',[],function(){
    return (/allAds/.test(location.search));
  });

})();
(function(){

  

  wpAdRequire.define('utils/debug',[],function(){
    return (/debugadcode/i.test(location.search));
  });

})();
(function(){

  

  wpAdRequire.define('utils/no_interstitials',[],function(){
    return (/no_interstitials/.test(location.search));
  });

})();
(function(){

  

  wpAdRequire.define('utils/flags',[
    'utils/allAds',
    'utils/debug',
    'utils/front',
    'utils/no_interstitials'
  ], function(allAds, debug, front, no_interstitials){

    return {
      allAds: allAds,
      debug: debug,
      front: front,
      no_interstitials: no_interstitials
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/getCookie',[],function(){

    /**
     * Reads a document cookie value.
     * @param {String} name The name of the cookie to read.
     * @return {String|null} The cookie value, or null if the cookie does not exist.
     */
    return function(name){
      var cookie = '' + document.cookie,
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
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/setCookie',[],function(){

    /**
     * Sets a document cookie
     * @param {String} name Name of the cookie
     * @param {String} val Value of the cookie
     * @param {String} opt_expires Expires
     * @param {String} opt_path Path
     * @param {String} opt_domain Domain
     * @param {Boolean} opt_secure Secure
     */
    return function (name, val, opt_expires, opt_path, opt_domain, opt_secure) {
      document.cookie = name + "=" + escape(val) + (opt_expires ? "; expires=" + opt_expires : "") +
        (opt_path ? "; path=" + opt_path : "") + (opt_domain ? "; domain=" + opt_domain : "") +
        (opt_secure ? "; secure" : "");
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/showInterstitial',[
    'utils/flags',
    'utils/getCookie',
    'utils/setCookie'
  ], function(flags, getCookie, setCookie){

    /**
     * Determines whether this page should get an interstitial, based on every 3rd page (non-front)
     * view via a cookie.
     * @type {Boolean} true to render the interstitial, false to not.
     */
    return (function(){
      if(document.cookie && !flags.no_interstitials){
        var name = document.domain + '_pageview',
          cookieVal = getCookie(name),
          rv = true,
          time = new Date(parseInt(new Date().getTime(), 10) + 432E5).toString();

        if(cookieVal){
          rv = Number(cookieVal)%3 ? false : true;
          setCookie(name, Number(cookieVal) + 1, time, '/');
        } else {
          setCookie(name, '1', time, '/');
        }

        return rv;
      }
      return false;
    })();

  });

})();
/**
 * Template of ad flights and available ad spots on washingtonpost.com (desktop)
 */
(function(){

  

  wpAdRequire.define('wp/config',[],function(){

    return {
      flights: {
        defaults: {
          what: [
            'leaderboard',
            'leaderboard_2',
            'flex',
            'flex_re',
            'flex_bb_hp',
            'flex_ss_bb',
            'flex_ss_tp',
            'flex_ss_bb_hp',
            '120x240',
            '200x50',
            '150x60',
            '285x29',
            'bigbox*',
            'bigbox_vi',
            'inline_bb',
            'itb',
            'skyscraper',
            'grid_bigbox*',
            'persistent_bb'
          ]
        },
        homepage: {
          what: ['!leaderboard'],
          where: ['washingtonpost.com']
        }
      },

      adTypes: {
        "120x240": { "size": [[120,240]], "keyvalues": { "ad": ["120x240"] } },
        "300x100": { "size": [[300,100]] },
        "336x35": { "size": [[336,35]], "keyvalues": { "ad": ["336x35"], "pos": ["ad19"] } },
        "336x35_top": { "size": [[336,35]], "keyvalues": { "ad": ["336x35"] } },
        "336x60": { "size": [[336,60]], "keyvalues": { "ad": ["336x60"] } },
        "200x50": { "size": [[200,50]], "keyvalues": { "ad": ["200x50"] } },
        "150x60": { "size": [[150,60]], "keyvalues": { "ad": ["150x60"] } },
        "285x29": { "size": [[285,29]], "keyvalues": { "ad": ["285x29"] } },
        "600x130": { "size": [[600,130]] },
        "88x31": { "size": [[88,31]] },
        "agoogleaday": { "size": [[1,1]] },
        "bigbox": { "size": [[300,250]], "keyvalues": { "ad": ["bb"], "pos": ["ad20"] } },
        "deal": { "size": [[1,1]], "keyvalues": { "ad": ["deal"], "pos": ["ad45"] } },
        "dealer_showcase": { "size": [[1,1]] },
        "extra_bb": { "size": [[300,250]], "keyvalues": { "ad": ["bb"], "pos": ["ad44"] } },
        "featrent": { "size": [[1,1]] },
        "featurebar": { "size": [[446,33]], "keyvalues": { "ad": ["fb"], "pos": ["ad7"] } },
        "flex": { "size": [[336,850]], "keyvalues": { "ad": ["hp"] } },
        "flex_bb_hp": { "size": [[300,250],[300,600],[336,850]], "keyvalues": { "ad": ["hp","bb"], "pos": ["ad16"] } },
        "flex_re": { "size": [[300,250],[300,600]], "keyvalues": { "ad": ["bb","tp"] } },
        "flex_ss_bb": { "size": [[160,600],[300,250]], "keyvalues": { "ad": ["ss","bb"] } },
        "flex_ss_bb_hp": { "size": [[160,600],[300,250],[300,600],[336,850]], "keyvalues": { "ad": ["ss","bb","hp"], "pos": ["ad6"] } },
        "flex_ss_tp": { "size": [[300,250],[300,600]], "keyvalues": { "ad": ["bb","tp"] } },
        "grid_bigbox":  { "size": [[300,250]] },
        "inline_bb": { "size": [[300,250]], "keyvalues": { "ad": ["inline_bb"] } },
        "interstitial": { "size": [['N/A']], "keyvalues": { "ad": ["interstitial"] } },
        "itb": { "size": [[1,1]] },
        "leaderboard": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad1"] } },
        "leaderboard_2": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad2"] } },
        "marketing": { "size": [[1,1]] },
        "mm_overlay": { "size": [[1,1]] },
        "nav_tile": { "size": [[1,1]] },
        "nn": { "size": [[200,80]] },
        "nn_footer": { "size": [[200,30]], "keyvalues": { "ad": ["nn_footer"] } },
        "nn_hp": { "size": [[190,20]], "keyvalues": { "ad": ["nn_hp"] } },
        "nn_rr": { "size": [[200,80]], "keyvalues": { "ad": ["nn_rr"] } },
        "nn_sidebar": { "size": [[200,30]], "keyvalues": { "ad": ["nn_sidebar"] } },
        "persistent_bb": { "size": [[300,250]] },
        "pptile": { "size": [[300,60]] },
        "promo": { "size": [[200,60]] },
        "pushdown": { "size": [[1,1]], "keyvalues": { "pos": ["ad43"] } },
        "skyscraper": { "size": [[160,600]], "keyvalues": { "ad": ["ss"], "pos": ["ad3"] } },
        "sponsor": { "size": [[1,1]] },
        "sponsor_links_bt": { "size": [[1,1]] },
        "sponsor_links_in": { "size": [[1,1]] },
        "sponsor_links_rr": { "size": [[1,1]] },
        "tiffany_tile": { "size": [[200,60], [184, 90]], "keyvalues": { "ad": ["tiff"], "pos": ["ad14"] } },
        "tooltile": { "size": [[1,1]] },
        "topjobs": { "size": [[1,1]] }
      }
    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/keywords',['utils/isArray', 'utils/wp_meta_data'], function(isArray, wp_meta_data){

    /**
     * A string of page keywords.
     * @type {String}
     */
    return (function () {
      if(wp_meta_data.keywords) {
        return isArray(wp_meta_data.keywords) ? wp_meta_data.keywords.join(",") :
          wp_meta_data.keywords;
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

  });

})();
(function(){

  

  wpAdRequire.define('utils/wordMatch',['utils/isArray'], function(isArray){

    /**
     * Checks each word in an array to see if that word (including variations) exists in a string.
     * @param {Array|String} wordList A list of words to check for.
     * @param {String} str String of words to check against.
     * @param {Boolean} opt_noVariations Set to true to just check exact words, without variations.
     * @return {Boolean} Returns true if a match is found, else returns false.
     */
    return function (wordList, str, opt_noVariations) {
      opt_noVariations = opt_noVariations || false;
      wordList = isArray(wordList) ? wordList : [wordList];
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
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/exclusions',[
    'utils/front',
    'utils/keywords',
    'utils/wordMatch'
  ], function(front, keywords, wordMatch){

    return function(){
      var rv = [],
        obj = {
          natural_disaster : ['shell', 'exxon', 'citgo', 'bp', 'chevron', 'hess', 'sunoco',
            'disaster', 'fire', 'explosion', 'oil', 'coal', 'death', 'dead', 'quake', 'earthquake',
            'tsunami', 'tornado', 'hurricane', 'flood','bed bug','infestation'],
          human_disaster : ['shoot', 'vatican', 'spanair', 'aground', 'rescue', 'attack', 'disaster',
            'explosion', 'war', 'hostage', 'terror', 'terrorist', 'bomb', 'blast', 'mining', 'miner',
            'violence', 'riot', 'crash', '9/11', 'sept. 11', 'september 11'],
          financial_crisis : ['corrupt', 'goldman', 'aig', 'foreclosure', 'enron', 'sec', 'mortgage',
            'Insurance', 'health', 'bank', 'wall street', 'protest', 'labor strike', 'union strike',
            'labor issue', 'union issue', 'teacher strike', 'teachers strike', 'election'],
          inappropriate : ['gambling','sex','alcohol','pornography']
        },
        key;

      if(!front) {
        for(key in obj) {
          if(obj.hasOwnProperty(key) && wordMatch(obj[key], keywords)) {
            rv.push(key);
          }
        }
      }

      return rv;
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/front',['utils/front'], function(front){

    return function(){
      return front ? ['y'] : ['n'];
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/kw',['utils/urlCheck'], function(urlCheck){

    return function(){
      var param = urlCheck('test_ads', { type: 'variable' });
      return param ? ['test_' + param] : false;
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/pageId',['utils/wp_meta_data'], function(wp_meta_data){

    return function(){
      if(!wp_meta_data.page_id){
        return false;
      }
      var l = wp_meta_data.page_id.length;
      while(l--){
        wp_meta_data.page_id[l] = wp_meta_data.page_id[l].replace(/\./g, '_');
      }
      return wp_meta_data.page_id;
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/poe',[
    'utils/setCookie',
    'utils/getCookie'
  ], function(setCookie, getCookie){

    return function(){
      var name = window.location.hostname + '_poe';
      if(getCookie(name)){
        return ['no'];
      } else {
        setCookie(name, 'true', '', '/', '','');
        return ['yes'];
      }
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/ref',[],function(){

    return function(){
      var ref = [],
        r = document.referrer || '';
      if(/facebook\.com|digg\.com|reddit\.com|myspace\.com|newstrust\.net|twitter\.com|delicious\.com|stumbleupon\.com/i.test(r)) {
        ref.push('social');
      }
      if(location.search.match('wpisrc=')) {
        ref.push('email');
      }
      return ref;
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/rs',['utils/getCookie'], function(getCookie){

    return function(){
      var cookie = getCookie('rsi_segs'),
        rv = [],
        i, l;
      if(cookie){
        cookie = cookie.replace(/J05531_/gi, 'j').replace(/D08734_/gi, 'd').split('|');
        l = cookie.length;
        for(i=0;i<l;i++){
          rv.push(cookie[i]);
        }
      }
      return rv;
    };

  });

})();
(function(){

  

  wpAdRequire.define('keyvalues/u',[
    'utils/getCookie',
    'utils/wp_meta_data',
    'utils/zoneBuilder'
  ], function(getCookie, wp_meta_data, zoneBuilder){

    return function(){
      var s_vi = getCookie('s_vi'),
        rv = false;

      //pass in s_vi cookie value:
      if(s_vi) {
        s_vi = s_vi.split(/\|/)[1];
        if(s_vi) {
          s_vi = s_vi.split(/\[/)[0].split(/-/);
          rv = 'o*' + s_vi[0] + ',' + s_vi[1];

          //get page name, replace spaces with underscores and then limit the string to 100 characters
          if(window.TWP && TWP.Data && TWP.Data.Tracking && TWP.Data.Tracking.props && TWP.Data.Tracking.props.page_name){
            rv += ',' + TWP.Data.Tracking.props.page_name.replace(/ /g, '_').slice(0, 100);
          }

          //",,,", then get page type and then need to append ",abc" to the end
          rv += ',,,' + (wp_meta_data.contentType && zoneBuilder.contentType[wp_meta_data.contentType.toString()] ?
            zoneBuilder.contentType[wp_meta_data.contentType.toString()] : 'article') + ',abc';
        }
      }

      return [rv];
    };

  });

})();
(function(){

  

  wpAdRequire.define('packages/desktop/keyvalues',[
    'keyvalues/exclusions',
    'keyvalues/front',
    'keyvalues/kw',
    'keyvalues/pageId',
    'keyvalues/poe',
    'keyvalues/ref',
    'keyvalues/rs',
    'keyvalues/u'
  ], function(exclusions, front, kw, pageId, poe, ref, rs, u){

    /**
     * Each key can take either a function, or an Array of functions that can assign multiple values
     * to that particular key.
     */
    return {
      '!c': [exclusions],
      front: [front],
      kw: [kw],
      pageId: [pageId],
      poe: [poe],
      ref: [ref],
      rs: [rs],
      u: [u]
    };

  });

})();
/**
* Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
*/
(function(){

  

  wpAdRequire.define('wp/keyvalues',[
    'utils/extendKeyvalues',
    'packages/desktop/keyvalues',
    'utils/wp_meta_data',
    'utils/wordMatch',
    'utils/keywords',
    'utils/getCookie'
  ], function(extendKeyvalues, kvs, wp_meta_data, wordMatch, keywords, getCookie){

    return extendKeyvalues(kvs, {

      articleId: [
        function(){
          var id = [], a;
          if(wp_meta_data.contentType && wp_meta_data.contentType[0] === "CompoundStory") {
            a = location.href.split("/");
            id = [a[a.length - 1].toLowerCase().split("_story")[0]];
          }
          return id;
        }
      ],

      kw: [
        function(){
          var rv = [],
            categories = {
              energy: ['energy'],
              re: ['builder', 'condo', 'home', 'homeowner', 'housing', 'mortgage', 'property',
                  'real estate', 'realtor', 'refinance', 'neighborhood']
            },
            key;

          for(key in categories) {
            if(categories.hasOwnProperty(key) && wordMatch(categories[key], keywords)) {
              rv.push(key);
            }
          }
          return rv;
        }
      ],

      WPATC: [
        function(){
          var cookie = getCookie('WPATC'),
            rv = {},
            l, a, key;

          if(cookie) {
            cookie = unescape(cookie).split(':');
            l = cookie.length;
            while(l--) {
              a = cookie[l].split('=');
              if(rv[a[0]]) {
                rv[a[0]].push(a[1]);
              } else {
                rv[a[0]] = [a[1]];
              }
            }
          }

          return rv;
        }
      ]

    });

  });

})();
/**
 * Provides core functionality for overrides
 */
(function(){

  

  wpAdRequire.define('overrides',[],function(){

    return {

      /**
       * Takes an Ad object (initially defined in Ad.js), modifies it with any specific overrides, then returns it
       */
      exec: function(ad) {
        var key, check, r;
        for(key in this.checks){
          if(this.checks.hasOwnProperty(key) && ad.config[key]){
            for(check in this.checks[key]){
              if(this.checks[key].hasOwnProperty(check)){
                r = new RegExp(check, 'i');
                if(r.test(ad.config[key])){
                  this.checks[key][check].call(ad);
                }
              }
            }
          }
        }
        return ad;
      },

      /**
       * Placeholder. Define the checks in site specific overrides script
       */
      checks: {}

    };

  });

})();
(function(){

  

  wpAdRequire.define('utils/reload',['utils/urlCheck'], function(urlCheck){
    return urlCheck('reload', { type: 'variable' }) === 'true';
  });

})();
/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
 */
(function() {

  

  wpAdRequire.define('wp/overrides',['overrides', 'utils/reload'], function(overrides, reload) {

    /**
    * Object of checks for overrides
    * keys of check functions will be evaluated as Regular Expressions.
    * EG: key could = '^politics$'
    */
    overrides.checks = {
      pos: {
        'leaderboard$': function() {
          if (this.config.where === 'washingtonpost.com') {
            this.config.where += '/lb';
          }
        },
        'featrent$': function() {
          if (window.jquery) {
            $('#wpni_adi_featrent').css({
              background: 'none',
              padding: '0'
            });
          }
        },
        '^tiffany_tile$': function() {
          if (this.config.where === "washingtonpost.com") {
            this.config.size = ['184x90'];
          }
        },
        'flex_ss_bb_hp': function() {
          if (this.config.where === 'lifestyle/home' ||
            this.config.where === 'lifestyle/home/front' ||
            this.config.where === 'lifestyle/home-garden') {
            this.config.where += '/flex';
          }
        }
      },
      where: {
        '^politics$': function() {
          this.config.where += '/front';
        },
        '^washingtonpost.com$': function() {
          if ((this.config.pos === 'leaderboard' || this.config.pos === 'flex_bb_hp') && reload) {
            this.config.where += 'refresh';
          }
          if (this.config.pos === 'pushdown') {
            var adi_push = document.getElementById('wpni_adi_pushdown');
            if (adi_push) {
              adi_push.style.backgroundImage = 'url(http://img.wpdigital.net/wp-adv/test/mstest/pushdown-ad-small.png)';
              adi_push.style.backgroundPosition = '-7px -100px';
            }
          }
        },
        //this breaks.. need to look into this one
        'washingtonpost\.com|personalpost|obituaries|weather|jobs\/search': function() {
          this.keyvalues['!c'] = this.keyvalues['!c'] || [];
          this.keyvalues['!c'].push('intrusive');
        }
      }
    };

    return overrides;

  });

})();

/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(){

  

  wpAdRequire.define('siteScript',[

    'defaultSettings',
    'Ad',
    'gptConfig',
    'utils/zoneBuilder',
    'utils/templateBuilder',
    'utils/extend',
    'utils/extendKeyvalues',
    'utils/front',
    'utils/showInterstitial',
    'utils/flags',
    'wp/config',
    'wp/keyvalues',
    'wp/overrides'

  ], function(

    defaultSettings,
    Ad,
    gptConfig,
    zoneBuilder,
    templateBuilder,
    extend,
    extendKeyvalues,
    front,
    showInterstitial,
    flags,
    config,
    kvs,
    overrides

  ){

    //build commercialNode
    commercialNode = zoneBuilder.exec();

    //extend or add keyvalues at the ad level
    //each key can accept a function, or an array of functions
    extendKeyvalues(Ad.prototype.keyvaluesConfig, {
      ad: function(){
        if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
          return config.adTypes[this.config.what].keyvalues.ad;
        }
      },
      pos: function(){
        var c = config.adTypes[this.config.pos];
        if(c && c.keyvalues && c.keyvalues.pos){
          return c.keyvalues.pos;
        }
      }
    });

    //add page specific keyvalues
    extendKeyvalues(gptConfig.keyvaluesConfig, kvs);

    //Custom flight templates that require additional conditionals
    config.flights = extend({
      interstitial: {
        what: ['interstitial'],
        test: [showInterstitial && !front]
      }
    }, config.flights);

    return extend(defaultSettings, {

      constants: {
        dfpSite: '/701/wpni.',
        domain: 'washingtonpost.com'
      },

      //Ad builder
      Ad: Ad,

      //Initial GPT setup
      gptConfig: gptConfig.init({
        sra: false
      }),

      flags: flags,

      config: config,

      //determine open ad spots
      flights: templateBuilder.exec(config.flights),

      //overrides
      overrides: overrides,

      cleanScriptTags: function(){
        // Found a call to this on a test page. Adding dummy function to prevent errors until we
        // figure out what to do with this, as it won't be needed when we switch to GPT
        return false;
      }

    });
  });

})();
(function(){

  

  wpAdRequire.define('utils/getScript',[],function(){

    /**
     * Asynchronously append a JavaScript File to the <head>, with optional onload callback.
     * @param {String|Object} url URL to the JavaScript file to be loaded.
     * @param {Function} opt_callback Callback function to execute once the script has loaded.
     */
    return function(src, opt_callback) {
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
    };

  });

})();
/*global placeAd2:true, placeAd2Queue */
/*jshint indent:2*/

/**
 * Universal script that does adops initialisation and loads site specific ad script
 */
(function(){

  

  //no_ads flag test:
  if(/no_ads/.test(location.search)){
    return false;
  }

  var gptScript = document.createElement('script');
  gptScript.src = 'http://www.googletagservices.com/tag/js/gpt.js';
  gptScript.async = true;
  document.getElementsByTagName('head')[0].appendChild(gptScript);

  //configure requirejs;
  wpAdRequire.require.config({
    baseUrl: 'js',
    paths: {
      //remove from optimized script - just here for dev
      'siteScript': 'wp/main',
      'googletag': 'http://www.googletagservices.com/tag/js/gpt',
      //'googletag': 'lib/gpt',
      'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
      'jqueryUI': 'lib/jquery-ui.min'
    },
    shim: {
      'googletag': {
        exports: 'googletag'
      },
      'jqueryUI':{
        deps: ['jquery'],
        exports: '$'
      }
    }
  });

  //load dependencies:
  wpAdRequire.require(['siteScript', 'utils/getScript'], function (wpAd, getScript){

    if(wpAd.flags.debug){
      getScript('js/debug.js');
    }

    //add to placeAd2queue
    placeAd2(commercialNode, 'interstitial', false, '');

    googletag.cmd.push(function(){

      placeAd2 = function(where, what, del, onTheFly){

        var pos = what,
          posOverride = false,
          posArray,
          ad;

        //determine pos value and potential posOverride
        if(/\|/.test(what)){
          posArray = what.split(/\|/);
          what = posArray[0];
          posOverride = posArray[1];
          pos = posArray.join('_');
        }

        //if the ad type is legit, open and hasn't already been built/rendered on the page
        if((wpAd.flights && wpAd.flights[pos] || wpAd.flights[what + '*']) && wpAd.config.adTypes[what] || wpAd.flags.allAds){
          if(!wpAd.adsOnPage[pos]){

            //build and store our new ad
            ad = new wpAd.Ad({
              templateSettings: wpAd.config.adTypes[what],
              dfpSite: wpAd.constants.dfpSite,
              where: where,
              size: wpAd.config.adTypes[what].size,
              what: what,
              pos: pos,
              posOverride: posOverride,
              hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false,
              onTheFly: onTheFly
            });

            //overrides (the new hackbin)
            if(wpAd.overrides){
              ad = wpAd.overrides.exec(ad);
            }

            //display the gpt ad
            ad.render();

            //store for debugging
            wpAd.adsOnPage[pos] = ad;

          } else{
            //refresh if ad/spot already rendered
            wpAd.adsOnPage[pos].slot.refresh();
          }

        } else {
          wpAd.adsDisabledOnPage[pos] = true;
        }

        //always create this queue. If we want to implement debug as bookmarklet, this will be referenced:
        wpAd.debugQueue.push(pos);

      };

      //build and display queued up ads from previous placeAd2 calls
      callPlaceAd2Queue(window.placeAd2Queue);

    });


    //expose wpAd to the window for debugging + external code to access/build off of.
    window.wpAd = wpAd;

  });

  /**
   * Calls queued up placeAd2 calls when placeAd2 is redefined above
   */
  function callPlaceAd2Queue(queue){
    if(queue){
      var l = queue.length,
        i = 0;
      for(i;i<l;i++){
        placeAd2.apply(window, queue[i]);
      }
    }
  }

})();
wpAdRequire.define("main", function(){});
