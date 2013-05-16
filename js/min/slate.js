(function () {
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

define("lib/almond", function(){});

(function(){var e=void 0,g=!0,h=null,k=!1,l,n=this,aa=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&
!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},p=function(a){return"array"==aa(a)},ba=function(a){var b=aa(a);return"array"==b||"object"==b&&"number"==typeof a.length},r=function(a){return"string"==typeof a},s=function(a){return"number"==typeof a},t=function(a){return"function"==aa(a)},ca="closure_uid_"+(1E9*Math.random()>>>0),da=0,ea=function(a,b,c){return a.call.apply(a.bind,arguments)},fa=function(a,
b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},ga=function(a,b,c){ga=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa;return ga.apply(h,arguments)},u=function(a,b){function c(){}c.prototype=b.prototype;a.Yb=b.prototype;a.prototype=new c};var x=function(a){a=parseFloat(a);return isNaN(a)||1<a||0>a?0:a},ha=/^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,y=function(a,b){if(!a)return b;var c=a.match(ha);return c?c[0]:b};var ia=x("0.02"),ja=x("1"),ka=x("1");var la=x("0.005"),ma=x("0.01"),na=x("0.001"),oa=parseInt("1500",10),pa=isNaN(oa)?1500:oa,qa=x("0.5"),ra=x("0.0");var sa=/^true$/.test("false")?g:k;var ta=function(){return y("","pagead2.googlesyndication.com")};var ua="http://"+ta()+"/pagead/show_ads.js";var z=function(){return n.googletag||(n.googletag={})},A=function(a,b,c){var d=z();if(!(a in d)||c)d[a]=b},va=function(a,b){a.addEventListener?a.addEventListener("load",b,k):a.attachEvent&&a.attachEvent("onload",b)};var C={};C[1]=ta();C[2]=y("","pubads.g.doubleclick.net");C[3]=y("","securepubads.g.doubleclick.net");C[4]=y("","partner.googleadservices.com");C[5]=ua;C[6]=sa;C[7]=ia;C[8]=ja;C[9]=ka;C[10]=ma;C[11]=na;C[12]=la;C[13]=pa;C[15]=qa;A("_vars_",C);var E=function(a,b,c,d,f){this.na=new Date;this.q=d||h;this.ma=c||h;this.Ra=a;this.Sa=b;this.la=f||h};l=E.prototype;l.cb=function(){return this.q};l.bb=function(){return this.ma};l.ab=function(){return this.Ra};l.Xa=function(){return this.na};l.Fb=function(){return this.Sa};l.Hb=function(){return this.la};var wa=["Debug","Info","Warning","Error","Fatal"];
E.prototype.toString=function(){var a=this.na.toTimeString()+": "+wa[this.Ra]+": "+this.Sa;this.la&&(a+=" Duration: "+(this.na.getTime()-this.la.Xa().getTime())+"ms.");return a};E.prototype.getTimestamp=E.prototype.Xa;E.prototype.getService=E.prototype.bb;E.prototype.getSlot=E.prototype.cb;E.prototype.getLevel=E.prototype.ab;E.prototype.getMessage=E.prototype.Fb;E.prototype.getReference=E.prototype.Hb;var F=function(){this.H=[]};F.prototype.vb=function(){return this.H};F.prototype.Cb=function(a){return xa(this,function(b){return b.bb()===a})};F.prototype.Db=function(a){return xa(this,function(b){return b.cb()===a})};F.prototype.Bb=function(a){return xa(this,function(b){return b.ab()>=a})};var xa=function(a,b){for(var c=[],d=0;d<a.H.length;++d)b(a.H[d])&&c.push(a.H[d]);return c};F.prototype.log=function(a,b,c,d,f){a=new E(a,b,c,d,f);this.H.push(a);return a};
F.prototype.info=function(a,b,c,d){return this.log(1,a,b,c,d)};var G=function(a,b,c,d){a.log(2,b,c,d,e)};F.prototype.error=function(a,b,c,d){return this.log(3,a,b,c,d)};var I=function(){var a=z();return a.debug_log||(a.debug_log=new F)};A("getEventLog",I);F.prototype.getAllEvents=F.prototype.vb;F.prototype.getEventsByService=F.prototype.Cb;F.prototype.getEventsBySlot=F.prototype.Db;F.prototype.getEventsByLevel=F.prototype.Bb;var J=function(){this.Ya=this.sa=0};J.prototype.push=function(a){for(var b=I(),c=0;c<arguments.length;++c)try{t(arguments[c])&&(arguments[c](),this.sa++)}catch(d){this.Ya++,b.error("Exception invoking function: "+d.message)}b.info("Invoked queued function. Total: "+this.sa+" Errors: "+this.Ya);return this.sa};J.prototype.push=J.prototype.push;(function(){function a(a){this.t={};this.tick=function(a,b,c){this.t[a]=[c!=e?c:(new Date).getTime(),b]};this.tick("start",h,a)}var b=new a;window.GPT_jstiming={Timer:a,load:b};if(window.performance&&window.performance.timing){var b=window.performance.timing,c=window.GPT_jstiming.load,d=b.navigationStart,b=b.responseStart;0<d&&b>=d&&(c.tick("_wtsrt",e,d),c.tick("wtsrt_","_wtsrt",b),c.tick("tbsd_","wtsrt_"))}try{b=h,window.chrome&&window.chrome.csi&&(b=Math.floor(window.chrome.csi().pageT),c&&0<d&&
(c.tick("_tbnd",e,window.chrome.csi().startE),c.tick("tbnd_","_tbnd",d))),b==h&&window.gtbExternal&&(b=window.gtbExternal.pageT()),b==h&&window.external&&(b=window.external.pageT,c&&0<d&&(c.tick("_tbnd",e,window.external.startE),c.tick("tbnd_","_tbnd",d))),b&&(window.GPT_jstiming.pt=b)}catch(f){}})();if(window.GPT_jstiming){window.GPT_jstiming.$a={};window.GPT_jstiming.lb=1;var ya=function(a,b,c){var d=a.t[b],f=a.t.start;if(d&&(f||c))return d=a.t[b][0],c!=e?f=c:f=f[0],d-f},za=function(a,b,c){var d="";window.GPT_jstiming.pt&&(d+="&srt="+window.GPT_jstiming.pt,delete window.GPT_jstiming.pt);try{window.external&&window.external.tran?d+="&tran="+window.external.tran:window.gtbExternal&&window.gtbExternal.tran?d+="&tran="+window.gtbExternal.tran():window.chrome&&window.chrome.csi&&(d+="&tran="+window.chrome.csi().tran)}catch(f){}var m=
window.chrome;if(m&&(m=m.loadTimes)){m().wasFetchedViaSpdy&&(d+="&p=s");if(m().wasNpnNegotiated){var d=d+"&npn=1",q=m().npnNegotiatedProtocol;q&&(d+="&npnv="+(encodeURIComponent||escape)(q))}m().wasAlternateProtocolAvailable&&(d+="&apa=1")}var B=a.t,D=B.start,m=[],q=[],v;for(v in B)if("start"!=v&&0!=v.indexOf("_")){var w=B[v][1];w?B[w]&&q.push(v+"."+ya(a,v,B[w][0])):D&&m.push(v+"."+ya(a,v))}delete B.start;if(b)for(var H in b)d+="&"+H+"="+b[H];(b=c)||(b="https:"==document.location.protocol?"https://csi.gstatic.com/csi":
"http://csi.gstatic.com/csi");return[b,"?v=3","&s="+(window.GPT_jstiming.sn||"gpt")+"&action=",a.name,q.length?"&it="+q.join(","):"","",d,"&rt=",m.join(",")].join("")},Aa=function(a,b,c){a=za(a,b,c);if(!a)return"";b=new Image;var d=window.GPT_jstiming.lb++;window.GPT_jstiming.$a[d]=b;b.onload=b.onerror=function(){window.GPT_jstiming&&delete window.GPT_jstiming.$a[d]};b.src=a;b=h;return a};window.GPT_jstiming.report=function(a,b,c){if("prerender"==document.webkitVisibilityState){var d=k,f=function(){if(!d){b?
b.prerender="1":b={prerender:"1"};var m;"prerender"==document.webkitVisibilityState?m=k:(Aa(a,b,c),m=g);m&&(d=g,document.removeEventListener("webkitvisibilitychange",f,k))}};document.addEventListener("webkitvisibilitychange",f,k);return""}return Aa(a,b,c)}};var K=Array.prototype,Ba=K.indexOf?function(a,b,c){return K.indexOf.call(a,b,c)}:function(a,b,c){c=c==h?0:0>c?Math.max(0,a.length+c):c;if(r(a))return!r(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ca=K.forEach?function(a,b,c){K.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=r(a)?a.split(""):a,m=0;m<d;m++)m in f&&b.call(c,f[m],m,a)};var L,Da,Ea,Fa,Ga=function(){return n.navigator?n.navigator.userAgent:h};Fa=Ea=Da=L=k;var Ha;if(Ha=Ga()){var Ia=n.navigator;L=0==Ha.indexOf("Opera");Da=!L&&-1!=Ha.indexOf("MSIE");Ea=!L&&-1!=Ha.indexOf("WebKit");Fa=!L&&!Ea&&"Gecko"==Ia.product}var Ja=L,M=Da,Ka=Fa,La=Ea,Ma=function(){var a=n.document;return a?a.documentMode:e},Na;
t:{var Oa="",N;if(Ja&&n.opera)var Pa=n.opera.version,Oa="function"==typeof Pa?Pa():Pa;else if(Ka?N=/rv\:([^\);]+)(\)|;)/:M?N=/MSIE\s+([^\);]+)(\)|;)/:La&&(N=/WebKit\/(\S+)/),N)var Qa=N.exec(Ga()),Oa=Qa?Qa[1]:"";if(M){var Ra=Ma();if(Ra>parseFloat(Oa)){Na=String(Ra);break t}}Na=Oa}
var Sa=Na,Ta={},Ua=function(a){if(!Ta[a]){for(var b=0,c=String(Sa).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),f=Math.max(c.length,d.length),m=0;0==b&&m<f;m++){var q=c[m]||"",B=d[m]||"",D=RegExp("(\\d*)(\\D*)","g"),v=RegExp("(\\d*)(\\D*)","g");do{var w=D.exec(q)||["","",""],H=v.exec(B)||["","",""];if(0==w[0].length&&0==H[0].length)break;b=((0==w[1].length?0:parseInt(w[1],10))<(0==H[1].length?0:parseInt(H[1],10))?-1:(0==w[1].length?0:
parseInt(w[1],10))>(0==H[1].length?0:parseInt(H[1],10))?1:0)||((0==w[2].length)<(0==H[2].length)?-1:(0==w[2].length)>(0==H[2].length)?1:0)||(w[2]<H[2]?-1:w[2]>H[2]?1:0)}while(0==b)}Ta[a]=0<=b}},Va=n.document,Wa=!Va||!M?e:Ma()||("CSS1Compat"==Va.compatMode?parseInt(Sa,10):5);if(Ka||M){var Xa;if(Xa=M)Xa=M&&9<=Wa;Xa||Ka&&Ua("1.9.1")}M&&Ua("9");var O=function(a,b){this.nb=a;this.mb=b};O.prototype.Lb=function(){return this.nb};O.prototype.Eb=function(){return this.mb};O.prototype.getWidth=O.prototype.Lb;O.prototype.getHeight=O.prototype.Eb;var P=function(a,b,c){this.A=a;this.Ua=s(b)?b:0;this.g=this.A+"_"+this.Ua;this.kb=c||"gpt_unit_"+this.g};l=P.prototype;l.p=function(){return this.g};l.getName=function(){return this.A};l.Wa=function(){return this.Ua};l.toString=P.prototype.p;l.l=function(){return this.kb};P.prototype.getId=P.prototype.p;P.prototype.getName=P.prototype.getName;P.prototype.getDomId=P.prototype.l;P.prototype.getInstance=P.prototype.Wa;var Ya=function(a){return a.replace(/[^a-zA-Z0-9]/g,function(a){return"&#"+a.charCodeAt()+";"})},Za=function(){var a=h,b=window,c=h;try{for(;b!=h&&b!==a;){c=b.location.protocol;if("https:"===c)break;else if("http:"===c||"file:"===c)return k;a=b;b=b.parent}}catch(d){}return g};var Q=function(a,b,c,d){this.A=a;var f=[];if(p(c))if(1<c.length&&s(c[0])&&s(c[1]))f.push(new O(c[0],c[1]));else for(var m=0;m<c.length;++m){var q=c[m];p(q)&&(1<q.length&&s(q[0])&&s(q[1]))&&f.push(new O(q[0],q[1]))}this.gb=f;this.g=new P(a,b,d);this.c=[];this.h={};this.n=h;this.b=I();this.b.info("Created slot: "+this.g,h,this);this.w=this.M=h;this.Ga=this.Fa="";this.$=g;this.d={};this.ba=[];this.Ha=k;this.Ea=this.Da=h;this.fb=k};l=Q.prototype;
l.set=function(a,b){var c=[" attribute ",a," with value ",b," for slot ",this.getName()].join("");a&&r(a)&&b?(this.h[a]=b,this.M||this.w?G(this.b,"Setting"+c+" after its contents have been loaded",h,this):this.b.info("Setting"+c,h,this)):G(this.b,"Unable to set"+c,h,this);return this};l.get=function(a){return a in this.h?this.h[a]:h};l.C=function(){var a=[],b;for(b in this.h)t(this.h[b])||a.push(b);return a};
l.ka=function(a){for(var b=0;b<this.c.length;++b)if(a==this.c[b])return G(this.b,"Service "+a.getName()+" is already associated with slot "+this.g,a,this),this;this.c.push(a);a.ea(this);return this};l.getName=function(){return this.A};l.i=function(){return this.g};l.Ta=function(){return this.c};l.Ib=function(){return this.gb};l.B=function(){return!!document.getElementById(this.g.l())};l.R=function(a){this.n=a};l.G=function(a){this.Ga=a;return this};l.ca=function(){return this.Ga};
l.ua=function(a){if(r(a)&&!/^[\s\xa0]*$/.test(a==h?"":String(a))){var b=this.ba;0<=Ba(b,a)||b.push(a);this.b.info("Setting slot level ad category exclusion: "+a,h,this)}else G(this.b,"Invalid slot level ad category exclusion label supplied",h,this);return this};l.ta=function(){this.b.info("Clearing all slot level ad category exclusions",h,this);this.ba=[];return this};l.wb=function(){var a;a=this.ba;var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];a=c}else a=[];return a};
l.recordImpression=function(){if(!this.fb)return G(this.b,"Not recording impression as enableManualImpression was not called on this slot.",h,this),this;for(var a=this.Ta(),b=k,c=0;c<a.length;++c){var d=a[c];d.isEnabled()&&(d.recordImpression(this),b=g)}b||G(this.b,"Not recording impression as no service is enabled.",h,this);return this};
l.s=function(a,b){var c=[];p(b)?c=b:b&&c.push(b.toString());var d=[" targeting attribute ",a," with value ",c.join()," for slot ",this.getName()].join("");if(a&&r(a)){this.b.info("Setting"+d,h,this);t:{var d=this.d[a],f=c;if(!ba(d)||!ba(f)||d.length!=f.length)d=k;else{for(var m=d.length,q=0;q<m;q++)if(d[q]!==f[q]){d=k;break t}d=g}}this.d[a]=c;if(!d&&(this.M||this.w))for(d=0;d<this.c.length;++d)f=this.c[d],f.isEnabled()&&f.Ia(this,a,c)}else G(this.b,"Unable to set"+d,h,this);return this};
l.ob=function(){this.b.info("Clearing slot targeting.",h,this);var a;t:{for(a in this.d){a=k;break t}a=g}this.d={};if(!a)for(a=0;a<this.c.length;++a){var b=this.c[a];b.isEnabled()&&b.clearSlotTargeting(this)}return this};l.Jb=function(){var a=this.d,b={},c;for(c in a)b[c]=a[c];return b};l.Gb=function(){return this.Ha};
l.Sb=function(a,b){this.Ea=(this.Da=a)&&Boolean(b);b&&!a&&G(this.b,"Ignoring a call to setCollapseEmptyDiv(false, true). Slots that start out collapsed should also collapse when empty. Slot "+this.g,h,this);return this};l.xb=function(){return this.Da};l.Ab=function(){return this.Ea};
var $a=function(a){if(!a.B())return a.b.error("Unable to write to slot "+a.g+". It has not yet been rendered.",h,a),k;var b=n.document,c=a.g.l(),b=b&&b.getElementById(c);if(!b)return a.b.error("Unable to find the div container with id "+c+" for slot "+a.g,h,a),k;c=a.n;return r(c)&&0<c.length?(a.Ka(),b.innerHTML=c,a.Ja(),g):k};l=Q.prototype;l.ub=function(a){this.M=this.b.info("Fetching ad for slot "+this.getName(),h,this);this.Fa=a};l.yb=function(){return this.Fa};
l.tb=function(){this.b.info("Receiving ad for slot "+this.getName(),h,this,this.M)};l.Ka=function(){this.w=this.b.info("Rendering ad for slot "+this.getName(),h,this)};l.Ja=function(){this.b.info("Completed rendering ad for slot "+this.getName(),h,this,this.w)};Q.prototype.set=Q.prototype.set;Q.prototype.get=Q.prototype.get;Q.prototype.getName=Q.prototype.getName;Q.prototype.getSlotId=Q.prototype.i;Q.prototype.getSizes=Q.prototype.Ib;Q.prototype.addService=Q.prototype.ka;
Q.prototype.getOutOfPage=Q.prototype.Gb;Q.prototype.getServices=Q.prototype.Ta;Q.prototype.getAttributeKeys=Q.prototype.C;Q.prototype.fetchStarted=Q.prototype.ub;Q.prototype.fetchEnded=Q.prototype.tb;Q.prototype.renderStarted=Q.prototype.Ka;Q.prototype.renderEnded=Q.prototype.Ja;Q.prototype.hasWrapperDiv=Q.prototype.B;Q.prototype.getContentUrl=Q.prototype.yb;Q.prototype.setClickUrl=Q.prototype.G;Q.prototype.getClickUrl=Q.prototype.ca;Q.prototype.clearTargeting=Q.prototype.ob;
Q.prototype.getTargetingMap=Q.prototype.Jb;Q.prototype.setTargeting=Q.prototype.s;Q.prototype.setCategoryExclusion=Q.prototype.ua;Q.prototype.clearCategoryExclusions=Q.prototype.ta;Q.prototype.getCategoryExclusions=Q.prototype.wb;Q.prototype.getCollapseEmptyDiv=Q.prototype.xb;Q.prototype.setCollapseEmptyDiv=Q.prototype.Sb;Q.prototype.getDivStartsCollapsed=Q.prototype.Ab;var R=function(){this.F={};this.N={};this.b=I()};R.prototype.add=function(a,b,c){if(!r(a)||0>=a.length||!b)return h;a in this.F||(this.F[a]=[]);b=new Q(a,this.F[a].length,b,c);c=b.i().l();if(this.N[c])return this.b.error("Div element "+c+" is already associated with another slot"),h;this.F[a].push(b);return this.N[b.i().l()]=b};R.prototype.find=function(a,b){var c=b||0,d=r(a)&&this.F[a]||[];return 0<=c&&c<d.length&&(d=d[c],d.i().Wa()==c)?d:h};
var ab=function(){var a=z();return a.slot_manager_instance||(a.slot_manager_instance=new R)},bb=function(a,b,c){var d=ab();return d&&d.add(a,b,c)};A("defineOutOfPageSlot",function(a,b){var c=ab();return!c?h:(c=c.add(a,[1,1],b))?(c.Ha=g,c):h});A("defineSlot",bb);A("defineUnit",bb);R.prototype.find=R.prototype.find;R.getInstance=ab;var cb=function(a){var b=I();if(r(a)){var c;c=ab();c.N[a]?c=c.N[a]:(G(c.b,"Ad unit lookup for div "+a+" failed."),c=h);if(c)if(a=c,a.$&&!a.B())G(a.b,"Slot "+a.A+" does not have a container div with id: "+a.g.l()+".",h,a);else for(b=0;b<a.c.length;++b)a.c[b].isEnabled()&&a.c[b].K(a);else b.error("Div "+a+" is not mapped to a known ad unit.")}else b.error("Unknown div id in display(): "+a.toString())};A("display",cb,g);var S=function(){this.Pa=[];this.Qa={};this.oa=k;this.h={};this.log=I();this.log.info("Created service: "+this.getName(),this)};l=S.prototype;l.getName=function(){return"unknown"};l.getVersion=function(){return"unversioned"};l.set=function(a,b){var c=["attribute ",a," with value ",b," for service ",this.getName()].join("");r(a)&&0<a.length?(this.h[a]=b,this.log.info("Setting "+c,this,h)):G(this.log,"Unable to set "+c,this,h);return this};l.get=function(a){return this.h[a]};
l.C=function(){var a=[],b;for(b in this.h)"function"!=typeof this.h[b]&&a.push(b);return a};l.j=function(){return this.Pa};l.Za=function(){return this.Qa};l.isEnabled=function(){return this.oa};l.enable=function(){if(this.oa)this.log.info("Service is already enabled.",this);else{this.oa=g;try{this.ra()}catch(a){this.log.error("Failed to enable service: "+a,this)}}};l.display=function(a,b,c,d){this.enable();a=c?bb(a,b,c):bb(a,b);a.ka(this);d&&a.G(d);cb(a.i().l())};
l.ea=function(a){this.Pa.push(a);this.Qa[a.i().p()]=a;this.log.info("Associated "+this.getName()+" service with slot "+a.getName(),this,a)};l.clearSlotTargeting=function(){};l.Ia=function(){};l.recordImpression=function(){};S.prototype.getSlots=S.prototype.j;S.prototype.getSlotIdMap=S.prototype.Za;S.prototype.enable=S.prototype.enable;S.prototype.set=S.prototype.set;S.prototype.get=S.prototype.get;S.prototype.getAttributeKeys=S.prototype.C;S.prototype.display=S.prototype.display;var db=function(a,b){this.name=a;this.qa=b?b:new n.GPT_jstiming.Timer;this.qa.name=a;this.pa=[]};l=db.prototype;l.getName=function(){return this.name};l.tick=function(a,b){this.qa.tick(a,b)};l.Va=function(a){a&&this.pa.push(a)};l.report=function(){var a="https:"==n.location.protocol?"https://www.google.com/csi":"http://csi.gstatic.com/csi",b={};this.pa.length&&(b.e=this.pa.join());return n.GPT_jstiming.report(this.qa,b,a)};l.eb=function(a){va(window,function(){setTimeout(a,10)})};
var T=function(a){this.name=a};u(T,db);T.prototype.tick=function(){};T.prototype.Va=function(){};T.prototype.report=function(){return h};T.prototype.eb=function(){};var eb=function(){var a=n.GPT_jstiming.load,b=0.01;b==e&&(b=0.01);return n.GPT_jstiming&&n.GPT_jstiming.load&&("http:"==n.location.protocol||"https:"==n.location.protocol)&&Math.random()<b?new db("global",a):new T("global")};
(function(){if(!z()._gpt_timer_&&n.GPT_jstiming){var a=eb();a.eb(function(){a.tick("load");a.report()});A("_gpt_timer_",a)}return z()._gpt_timer_})();var U=function(){this.c={};this.aa=k;this.b=I();this.ib=this.b.info("Google service JS loaded");va(window,ga(U.prototype.jb,this))};U.prototype.add=function(a){this.c[a.getName()]=a};U.prototype.find=function(a){var b=h;a in this.c&&(b=this.c[a]);return b};U.prototype.jb=function(){this.aa=g;this.b.info("Page load complete",h,h,this.ib)};
var fb=function(a,b,c){a=k;try{a=b.top.document.URL===c.URL}catch(d){}return a?c.URL:c.referrer},V=function(){var a=z();return a.service_manager_instance||(a.service_manager_instance=new U)};A("enableServices",function(){var a=V(),b;for(b in a.c){var c=a.c[b];if(!t(c)){c.enable();var c=b,d=z()._gpt_timer_;d&&d.Va(c)}}});var W=function(){S.call(this);this.La=g;this.ja=k;this.P=0;this.Q="";this.ha=this.ga=this.fa=this.D=e;this.Ma=this.ia=k;this.da={};this.O=k};u(W,S);l=W.prototype;
l.ra=function(){if(this.La){if(!this.Ma){var a=document,b=document.createElement("script");b.async=g;b.type="text/javascript";b.src=this.o();try{var c=a.getElementsByTagName("script")[0];this.log.info("Fetching companion ads implementation",this);this.Ma=g;c.parentNode&&c.parentNode.insertBefore(b,c)}catch(d){this.log.error("Unable to fetch companion ads implementation",this)}}}else this.ia||(n.document.write('<script type="text/javascript" src="'+Ya(this.o())+'">\x3c/script>'),this.ia=g)};
l.qb=function(){this.La=k};l.Tb=function(a){"boolean"==typeof a&&(this.ja=a)};l.Nb=function(a){if(this.ja){for(var b=this.Za(),c=[],d=0;d<a.length;++d){var f=a[d];f in b?c.push(b[f]):G(this.log,"Cannot find slot with id "+f+".",this)}gb(this,c)}};l.Na=function(){var a=googletag.pubads();if(!a.isEnabled())return k;var a=a.j(),b=this.j();if(a.length!=b.length)return k;for(var c=0;c<b.length;++c){for(var d=k,f=0;f<a.length;++f)if(b[c]===a[f]){d=g;break}if(!d)return k}return g};
l.Qb=function(){this.ja&&gb(this,h)};
l.Vb=function(a,b,c,d,f,m,q){this.O=k;this.P=0;this.Q="";this.ha=this.ga=this.fa=this.D=e;this.P=a;this.Q=b;this.D=c;0==this.D.length&&(this.D=e);t:{a=d.split(",");b=[];for(c=0;c<a.length;++c){d=a[c].split("x");if(2!=d.length){this.log.error("The master ad size specified is invalid.");a=e;break t}d=[Number(d[0]),Number(d[1])];if(isNaN(d[0])||isNaN(d[1])){this.log.error("The master ad size specified is invalid.");a=e;break t}b.push(d)}a=b}this.fa=a;f!==e&&(this.ga=f);m!==e&&(this.ha=m);q!==e&&(this.O=
q)};l.zb=function(){return googletag.pubads().getCorrelator()};l.getVideoStreamCorrelator=function(){return googletag.pubads().getVideoStreamCorrelator()};l.Wb=function(a){this.P=a};l.Xb=function(a){this.Q=a};
var gb=function(a,b){var c=googletag.pubads();if(c.isEnabled()){if(a.O){if(!a.Na()){G(a.log,"Persistent roadblock requested, but ad slots are incorrectly configured. All ad slots on page must have both pubads and companionAds services attached. Skipping refresh.");return}c.clearNoRefreshState();c.clear()}c.Oa(b,a.P,a.Q,a.D,a.fa,a.ga,a.ha,a.O)}else a.log.error("Pubads service is not enabled, cannot use refresh feature.")};l=W.prototype;
l.isSlotAPersistentRoadblock=function(a){var b=googletag.pubads();if(b.isEnabled())return b.isSlotAPersistentRoadblock(a);this.log.error("Pubads service is not enabled, cannot check whether slot is a persistent roadblock.  Content writing allowed.");return k};l.getName=function(){return"companion_ads"};l.o=function(){var a=document,b=h;try{b=a.location.protocol}catch(c){}return("https:"==b?"https:":"http:")+"//pagead2.googlesyndication.com/pagead/show_companion_ad.js"};
l.Pb=function(){this.log.info("Companion ads implementation fetched.",this);this.ia=g};l.r=function(a){var b=a&&a.i().p();return b&&b in this.da&&a.B()&&this.isEnabled()&&!this.isSlotAPersistentRoadblock(a)?(a.R(this.da[b]),$a(a)):k};l.K=function(a){this.r(a)};l.fillSlot=function(a,b){return a&&r(b)&&0<b.length?(this.da[a.i().toString()]=b,this.r(a)):k};A("companionAds",function(){var a=V(),b=a.find("companion_ads");b||(b=new W,a.add(b));return b});W.prototype.fillSlot=W.prototype.fillSlot;
W.prototype.enableSyncLoading=W.prototype.qb;W.prototype.isSlotAPersistentRoadblock=W.prototype.isSlotAPersistentRoadblock;W.prototype.isRoadblockingSupported=W.prototype.Na;W.prototype.onImplementationLoaded=W.prototype.Pb;W.prototype.notifyUnfilledSlots=W.prototype.Nb;W.prototype.refreshAllSlots=W.prototype.Qb;W.prototype.setRefreshUnfilledSlots=W.prototype.Tb;W.prototype.setXfpCorrelator=W.prototype.Wb;W.prototype.setXfpPreviousAdsToken=W.prototype.Xb;W.prototype.setVideoSessionInfo=W.prototype.Vb;
W.prototype.getDisplayAdsCorrelator=W.prototype.zb;W.prototype.getVideoStreamCorrelator=W.prototype.getVideoStreamCorrelator;var X=function(){S.call(this);this.n={}};u(X,S);l=X.prototype;l.getName=function(){return"content"};l.r=function(a){var b=a&&a.i().p();return b in this.n&&this.isEnabled()&&a.B()&&!a.w?(a.R(this.n[b]),$a(a)):k};l.ra=function(){for(var a=this.j(),b=0;b<a.length;++b)this.r(a[b])};l.K=function(a){this.r(a)};l.R=function(a,b){a&&(r(b)&&0<b.length)&&(this.n[a.i().p()]=b,this.r(a))};A("content",function(){var a=V(),b=a.find("content");b||(b=new X,a.add(b));return b});X.prototype.setContent=X.prototype.R;var hb=h,ib=Ka||La||Ja||"function"==typeof n.atob;var Y=function(a,b,c){!r(a)||0>=a.length||!b||!c?I().error("Illegal slot name or size in PassbackSlot(). Name: "+a+"; size: "+b+"; service: "+c):(this.q=new Q(a,this[ca]||(this[ca]=++da),b),this.q.ka(c),this.ma=c)};Y.prototype.G=function(a){this.q.G(a);return this};Y.prototype.s=function(a,b){this.q.s(a,b);return this};Y.prototype.display=function(){jb(this.ma,this.q)};Y.prototype.setClickUrl=Y.prototype.G;Y.prototype.setTargeting=Y.prototype.s;Y.prototype.display=Y.prototype.display;var Z=function(){S.call(this);this.u=k;this.a=h;this.va=0;this.d={};this.W=[];this.Aa=this.V="";this.za=k;this.xa=g;this.m=this.wa=k;this.f=g;this.S=this.I=this.ya=k;this.k=[];this.J=[];this.T=[];this.L=[];this.U=k;this.X={};this.Y=k;this.Ba=this.Ca="";this.v=[];var a=fb(V(),window,document);"108809006"==kb(a,"api_experiment")?this.Z("108809006"):!(1E-4>Math.random())&&Math.random()<2*ra&&this.Z(!(1E-4>Math.random())&&0.5>Math.random()?"108809006":"108809005")};u(Z,S);
var lb={adsense_ad_format:"google_ad_format",adsense_ad_types:"google_ad_type",adsense_allow_expandable_ads:"google_allow_expandable_ads",adsense_background_color:"google_color_bg",adsense_bid:"google_bid",adsense_border_color:"google_color_border",adsense_channel_ids:"google_ad_channel",adsense_content_section:"google_ad_section",adsense_cpm:"google_cpm",adsense_ed:"google_ed",adsense_encoding:"google_encoding",adsense_family_safe:"google_safe",adsense_feedback:"google_feedback",adsense_flash_version:"google_flash_version",
adsense_font_face:"google_font_face",adsense_font_size:"google_font_size",adsense_hints:"google_hints",adsense_host:"google_ad_host",adsense_host_channel:"google_ad_host_channel",adsense_host_tier_id:"google_ad_host_tier_id",adsense_keyword_type:"google_kw_type",adsense_keywords:"google_kw",adsense_line_color:"google_line_color",adsense_link_color:"google_color_link",adsense_relevant_content:"google_contents",adsense_reuse_colors:"google_reuse_colors",adsense_targeting:"google_targeting",adsense_targeting_types:"google_targeting",
adsense_test_mode:"google_adtest",adsense_text_color:"google_color_text",adsense_ui_features:"google_ui_features",adsense_ui_version:"google_ui_version",adsense_url_color:"google_color_url",alternate_ad_iframe_color:"google_alternate_color",alternate_ad_url:"google_alternate_ad_url",demographic_age:"google_cust_age",demographic_ch:"google_cust_ch",demographic_gender:"google_cust_gender",demographic_interests:"google_cust_interests",demographic_job:"google_cust_job",demographic_l:"google_cust_l",demographic_lh:"google_cust_lh",
demographic_u_url:"google_cust_u_url",demographic_unique_id:"google_cust_id",document_language:"google_language",geography_override_city:"google_city",geography_override_country:"google_country",geography_override_region:"google_region",page_url:"google_page_url"};
Z.prototype.ra=function(){if(this.f){if(!this.u){var a=document,b=a.createElement("script");V();b.async=g;b.type="text/javascript";b.src=this.o();(a=a.getElementsByTagName("head")[0]||a.getElementsByTagName("body")[0])?(this.log.info("Fetching GPT implementation",this),a.appendChild(b),this.u=g):this.log.error("Unable to fetch GPT implementation",this)}}else mb(this)};Z.prototype.getName=function(){return"publisher_ads"};
Z.prototype.o=function(){var a=Za()?"https:":"http:";return 0<=Ba(this.v,"108809006")?a+"//partner.googleadservices.com/gpt/pubads_impl_21.js":a+"//partner.googleadservices.com/gampad/google_ads_gpt.js"};var mb=function(a){var b=V();!a.u&&!b.aa&&(b=document,a.u=g,b.write('<script type="text/javascript" src="'+Ya(a.o())+'">\x3c/script>'))};
Z.prototype.fillSlot=function(a){this.log.info("Calling fillslot");this.a.fillSlot(a);this.X[a.getName()]=g;if(this.a)if(this.U){if((a=this.j()[0])&&a.getName()in this.X)this.refresh(),this.U=k}else for(a=0;a<this.L.length;a++){var b=this.L[a];b[0].getName()in this.X&&(this.refresh(b),K.splice.call(this.L,a,1),a--)}else this.log.error("Bad call to check refreshes before impl is loaded",this)};
Z.prototype.Ob=function(){V();var a=z().impl;if(a&&a.pubads){this.a=a.pubads;this.log.info("GPT implementation fetched.",this);t(this.a.setCookieOptions)&&this.a.setCookieOptions(this.va);this.xa||this.a.disableFetch();this.I&&this.a.collapseEmptyDivs(this.S);if(this.m){this.f?this.a.enableAsyncSingleRequest():this.a.enableSingleRequest();nb(this);for(var a=this.j(),b=0;b<a.length;++b)ob(this,a[b])}else this.f&&this.a.enableAsyncRendering();this.wa&&this.a.disableInitialLoad();pb(this);if(0<this.k.length)for(b=
0;b<this.k.length;++b)this.K(this.k[b]);if(0<this.J.length)for(b=0;b<this.J.length;++b)jb(this,this.J[b]);Ca(this.T,this.recordImpression,this);this.T=[]}else this.log.error("Unable to fetch pubads service implementation from "+this.o(),this)};Z.prototype.ea=function(a){this.f||(a.$=k);S.prototype.ea.call(this,a)};
Z.prototype.K=function(a){if(V().aa&&!this.f)this.log.error("Attempting to display ad in sync mode after page load is complete.",this);else if(this.a)nb(this),(this.m||ob(this,a))&&this.fillSlot(a);else if(this.f||this.u&&0==this.k.length){for(var b=k,c=0;c<this.k.length;++c)a===this.k[c]&&(b=g);b||(this.log.info("Delaying rendering of ad slot "+a.getName()+" pending loading of the GPT implementation",this,a),this.k.push(a))}else this.log.error("Skipping rendering of slot "+a.getName()+" due to missing GPT implementaition",
this,a)};
var ob=function(a,b){if(a.a&&a.a.addSlot(b)==h)return a.log.error("Unable to process name for slot "+b.getName(),a,b),k;for(var c=b.C(),d=0;d<c.length;++d)c[d]in lb?a.a.addAdSenseSlotAttribute(b,lb[c[d]],b.get(c[d])):G(a.log,"Ignoring unknown pubads attribute "+c[d]+" with value "+b.get(c[d])+" for slot "+b.getName(),a,b);if(t(a.a.addSlotTargeting)){var c=[],f;for(f in b.d)t(b.d[f])||c.push(f);for(f=0;f<c.length;++f)a.a.addSlotTargeting(b,c[f],c[f]in b.d?b.d[c[f]]:[])}b.ca()&&t(a.a.hb)&&a.a.hb(b,
b.ca());return g},nb=function(a){if(!a.za){a.za=g;for(var b=a.C(),c=0;c<b.length;++c)b[c]in lb?a.a.addAdSensePageAttribute(lb[b[c]],a.get(b[c])):G(a.log,"Ignoring unknown pubads attribute "+b[c]+" with value "+a.get(b[c]),a);a.a.addAdSensePageAttribute("google_tag_info","v2");for(var d in a.d)if(b=a.d[d],p(b))for(c=0;c<b.length;++c)a.a.addAttribute(d,b[c]);t(a.a.addPageCategoryExclusion)&&Ca(a.W,function(a){this.a.addPageCategoryExclusion(a)},a);t(a.a.setPublisherProvidedId)&&a.a.setPublisherProvidedId(a.Aa);
a.V&&a.a.setLocation(a.V);a.a.setCenterAds!==e&&a.a.setCenterAds(a.ya);a.a.setApiExperiment!==e?Ca(a.v,function(a){this.a.setApiExperiment(a)},a):0==a.v.length||G(a.log,"Ignoring forced experiments due to lack of support in the Pubads implementation. Experiments: "+a.v.join())}};l=Z.prototype;
l.setCookieOptions=function(a){if(!s(a)||!(isFinite(a)&&0==a%1)||0>a)return G(this.log,"Cookie options must be an integer number, 0 or greater. Ignoring value: "+a,this),this;this.va=a;this.a&&t(this.a.setCookieOptions)&&this.a.setCookieOptions(a);return this};l.s=function(a,b){var c=[];r(b)?c.push(b):c=b;var d=[" targeting attribute ",a," with value ",c.join()," for service ",this.getName()].join("");a&&r(a)?(this.d[a]=c,this.log.info("Setting"+d,this)):G(this.log,"Unable to set"+d,this);return this};
l.ua=function(a){if(r(a)&&!/^[\s\xa0]*$/.test(a==h?"":String(a))){var b=this.W;0<=Ba(b,a)||b.push(a);this.log.info("Setting page level ad category exclusion: "+a,this)}else G(this.log,"Invalid page level ad category exclusion label supplied",this);return this};l.ta=function(){this.log.info("Clearing all page level ad category exclusions",this);this.W=[];return this};l.Mb=function(){this.a?G(this.log,"Ignoring noFetch since the pubads service is already enabled",this):this.xa=k};
l.disableInitialLoad=function(){this.a?G(this.log,"Ignoring disableInitialLoad since the pubads service is already enabled",this):this.wa=g};l.enableSingleRequest=function(){this.isEnabled()&&!this.m?G(this.log,"Ignoring change to single request mode since the service is already enabled",this):(this.log.info("Using single request mode to fetch ads",this),this.m=g);return this.m};
l.enableAsyncRendering=function(){this.isEnabled()&&!this.f?G(this.log,"Ignoring change to async-rendering mode since the service is already enabled",this):(this.log.info("Using async-rendering mode to fetch ads",this),this.f=g);return this.f};
l.rb=function(){if(this.isEnabled()&&this.f)G(this.log,"Ignoring change to async-rendering mode since the service is already enabled",this);else{this.log.info("Using sync-rendering mode to fetch ads",this);this.f=k;for(var a=this.j(),b=0;b<a.length;++b)a[b].$=k}return!this.f};l.Rb=function(a){this.log.info("Setting centering to "+a,this);this.ya=a};
l.setPublisherProvidedId=function(a){this.isEnabled()?G(this.log,"Ignoring change to PPID since the service is already enabled. Not setting: "+a,this):(this.log.info("Setting PPID to "+a,this),this.Aa=a);return this};l.pb=function(a,b){return new Y(a,b,this)};var jb=function(a,b){mb(a);a.a?t(a.a.passback)?a.a.passback(b):a.log.error("The GPT impl does not yet support passbacks.",a,b):(a.log.info("Delaying passback of ad slot "+b.getName()+" pending loading of the GPT implementation",a,b),a.J.push(b))};
l=Z.prototype;
l.refresh=function(a){if(a&&!p(a))G(this.log,"Slots to refresh must be an array.",this);else{var b=h;if(a){for(var b=[],c=0;c<a.length;++c){var d=a[c];d instanceof Q?b.push(d):G(this.log,"Slot object at position "+c+" is of incorrect type.",this)}if(!b.length){this.log.error("No valid slot ids found, refresh aborted.",this);return}}this.a?(this.log.info("Refreshing ads",this),this.a.refresh(b)):this.m?(this.log.info("Refresh pushed on pending list until GPT implementation Javascript loads.",this),
b?(a=this.L,0<=Ba(a,b)||a.push(b)):this.U=g):G(this.log,"The ads cannot be refreshed because the GPT implementation Javascript is not yet loaded.",this)}};
l.Oa=function(a,b,c,d,f,m,q,B){if(a&&!p(a))G(this.log,"Slots to refresh must be an array.",this);else if(b&&!s(b))G(this.log,"Correlator must be a number.",this);else if(c&&!r(c))G(this.log,"Pstok must be a string.",this);else if(d&&!r(d))G(this.log,"Video IU must be a string.",this);else if(f&&!p(f))G(this.log,"Video IU sizes must be an array.",this);else if(m&&!s(m))G(this.log,"Pod number must be a number.",this);else if(q&&!s(q))G(this.log,"Pod position must be a number.",this);else if(B&&"boolean"!=
typeof B)G(this.log,"Persistent roadblocks only must be a boolean.",this);else if(this.a){var D=h;if(a){for(var D=[],v=0;v<a.length;++v){var w=a[v];w instanceof Q?D.push(w):G(this.log,"Slot object at position "+v+" is of incorrect type.",this)}if(!D.length){this.log.error("No valid slot ids found, refresh aborted.",this);return}}if(f)for(v=0;v<f.length;++v){a=f[v];if(!p(a)||2!=a.length){this.log.error("Video size array must have only two values, refresh aborted.",this);return}for(w=0;w<a.length;++w)if(!s(a[w])){this.log.error("Video size array must contain only numbers, refresh aborted.",
this);return}}this.log.info("Refreshing ads",this);this.a.refresh(D,b,c,d,f,m,q,B)}else G(this.log,"The ads cannot be refreshed because the GPT implementation Javascript is not yet loaded.",this)};l.sb=function(){this.Y=g;pb(this)};l.Ub=function(a,b){this.Y=g;this.Ca=a;this.Ba=b;pb(this)};l.Kb=function(){return!this.a||this.a.getVideoContentInformation==h?h:this.a.getVideoContentInformation()};var pb=function(a){a.Y&&(a.a&&a.a.setVideoContentInformation)&&a.a.setVideoContentInformation(a.Ca,a.Ba)};
l=Z.prototype;l.getCorrelator=function(){return 0==this.j().length?"not_available":!this.a?"not_loaded":this.a.getCorrelator==h?"not_available":this.a.getCorrelator()};l.getVideoStreamCorrelator=function(){if(!this.a||this.a.getVideoStreamCorrelator==h)return 0;var a=this.a.getVideoStreamCorrelator();return isNaN(a)?0:a};l.isAdRequestFinished=function(){return!this.a?k:this.a.isAdRequestFinished!=h?this.a.isAdRequestFinished():h};
l.isSlotAPersistentRoadblock=function(a){return this.a&&this.a.isSlotAPersistentRoadblock!=h?this.a.isSlotAPersistentRoadblock(a):k};
l.collapseEmptyDivs=function(a){this.I?G(this.log,"Ignoring subsequent call to set div collapse mode (already set)",this):this.isEnabled()?G(this.log,"Ignoring change to div collapse mode since the service is already enabled",this):(this.S=Boolean(a),this.log.info("Enabling collapsing of containers when there is no ad content. Collapse before ad fetch = "+this.S,this),this.I=g);return this.I};
l.clear=function(){if(!this.a)return G(this.log,"The slot contents cannot be cleared because the GPT implementation Javascript is not yet loaded.",this),k;if(this.a.clearSlotContents!=h)return this.log.info("Clearing slot contents.",this),this.a.clearSlotContents();G(this.log,"The GPT implementation does not yet support clearing slots.");return k};
l.clearNoRefreshState=function(){this.a?this.a.clearNoRefreshState!=h?(this.log.info("Clearing no_refresh state.",this),this.a.clearNoRefreshState()):G(this.log,"The GPT implementation does not yet support clearNoRefreshState"):G(this.log,"The no_refresh state cannot be cleared because the GPT implementation Javascript is not yet loaded.",this)};l.clearSlotTargeting=function(a){this.a&&t(this.a.clearSlotTargeting)&&this.a.clearSlotTargeting(a)};
l.Ia=function(a,b,c){this.a&&t(this.a.addSlotTargeting)&&this.a.addSlotTargeting(a,b,c)};l.recordImpression=function(a){this.a?t(this.a.recordImpression)?this.a.recordImpression(a):G(this.log,"The implementation does not support recordImpression, all impressions are recorded immediately.",this,a):this.T.push(a)};
l.setLocation=function(a,b,c){var d="role:1 producer:12";if(b!==e){if(!s(a)||!s(b))return G(this.log,"Latitude and longitude are expected to be numbers"),this;d+=" latlng{ latitude_e7: "+Math.round(1E7*a)+" longitude_e7: "+Math.round(1E7*b)+"}";if(c!==e){if(isNaN(c))return G(this.log,"Radius is expected to be a number"),this;d+=" radius:"+Math.round(c)}}else 50<a.length&&(b=a.substring(0,50),G(this.log,"Location: "+a+" is longer than 50. Truncating it to"+b+"."),a=b),d+=' loc:"'+a+'"';if(ib)d=n.btoa(d);
else{a=d;d=[];for(c=b=0;c<a.length;c++){for(var f=a.charCodeAt(c);255<f;)d[b++]=f&255,f>>=8;d[b++]=f}if(!ba(d))throw Error("encodeByteArray takes an array as a parameter");if(!hb){hb={};for(a=0;65>a;a++)hb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)}a=hb;b=[];for(c=0;c<d.length;c+=3){var m=d[c],q=(f=c+1<d.length)?d[c+1]:0,B=c+2<d.length,D=B?d[c+2]:0,v=m>>2,m=(m&3)<<4|q>>4,q=(q&15)<<2|D>>6,D=D&63;B||(D=64,f||(q=64));b.push(a[v],a[m],a[q],a[D])}d=b.join("")}this.V=
"a "+d;return this};l.getVersion=function(){return!this.a?e:this.a.getVersion==h?"unversioned":this.a.getVersion()};l.Z=function(a){this.isEnabled()?G(this.log,"Ignoring experiment since the service is already enabled. Not setting: "+a,this):this.v.push(a)};A("pubads",function(){var a=V(),b=a.find("publisher_ads");b||(b=new Z,a.add(b));return b});Z.prototype.clear=Z.prototype.clear;Z.prototype.clearNoRefreshState=Z.prototype.clearNoRefreshState;Z.prototype.collapseEmptyDivs=Z.prototype.collapseEmptyDivs;
Z.prototype.definePassback=Z.prototype.pb;Z.prototype.enableAsyncRendering=Z.prototype.enableAsyncRendering;Z.prototype.enableSingleRequest=Z.prototype.enableSingleRequest;Z.prototype.enableSyncRendering=Z.prototype.rb;Z.prototype.enableVideoAds=Z.prototype.sb;Z.prototype.forceExperiment=Z.prototype.Z;Z.prototype.getCorrelator=Z.prototype.getCorrelator;Z.prototype.getVideoContent=Z.prototype.Kb;Z.prototype.getVideoStreamCorrelator=Z.prototype.getVideoStreamCorrelator;
Z.prototype.isAdRequestFinished=Z.prototype.isAdRequestFinished;Z.prototype.isSlotAPersistentRoadblock=Z.prototype.isSlotAPersistentRoadblock;Z.prototype.noFetch=Z.prototype.Mb;Z.prototype.onGoogleAdsJsLoad=Z.prototype.Ob;Z.prototype.refresh=Z.prototype.refresh;Z.prototype.setLocation=Z.prototype.setLocation;Z.prototype.setTargeting=Z.prototype.s;Z.prototype.setCategoryExclusion=Z.prototype.ua;Z.prototype.clearCategoryExclusions=Z.prototype.ta;Z.prototype.setVideoContent=Z.prototype.Ub;
Z.prototype.getVersion=Z.prototype.getVersion;Z.prototype.videoRefresh=Z.prototype.Oa;Z.prototype.setCentering=Z.prototype.Rb;Z.prototype.setPublisherProvidedId=Z.prototype.setPublisherProvidedId;Z.prototype.setCookieOptions=Z.prototype.setCookieOptions;var qb=/#|$/,kb=function(a,b){var c=a.search(qb),d;t:{d=0;for(var f=b.length;0<=(d=a.indexOf(b,d))&&d<c;){var m=a.charCodeAt(d-1);if(38==m||63==m)if(m=a.charCodeAt(d+f),!m||61==m||38==m||35==m)break t;d+=f+1}d=-1}if(0>d)return h;f=a.indexOf("&",d);if(0>f||f>c)f=c;d+=b.length+1;return decodeURIComponent(a.substr(d,f-d).replace(/\+/g," "))};var rb=function(){var a=window,b=document;if(z()._pubconsole_disable_)return k;var c;c=document.cookie.split("google_pubconsole=");if(c=2==c.length?c[1].split(";")[0]:"")if(c=c.split("|"),0<c.length&&("1"==c[0]||"0"==c[0]))return g;a=fb(V(),a,b);return kb(a,"google_debug")!==h||kb(a,"google_console")!==h||kb(a,"google_force_console")!==h},sb=function(){if(rb()){var a=document,b=a.createElement("script");b.type="text/javascript";b.src=(Za()?"https:":"http:")+"//publisherconsole.appspot.com/js/loader.js";
b.async=g;(a=a.getElementsByTagName("script")[0])&&a.parentNode&&a.parentNode.insertBefore(b,a)}};"complete"===document.readyState?sb():va(window,sb);A("disablePublisherConsole",function(){z()._pubconsole_disable_=g});A("getVersion",function(){return"21"});var $=z().cmd;if(!$||p($)){var tb=z().cmd=new J;$&&0<$.length&&tb.push.apply(tb,$)}(function(){var a=document.getElementsByTagName("script");0<a.length&&(a=a[a.length-1],a.src&&(0<=a.src.indexOf("/tag/js/gpt.js")&&a.innerHTML&&!a.googletag_executed)&&(a.googletag_executed=g,eval(a.innerHTML)))})();})()
;
define("gpt", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.googletag;
    };
}(this)));

/**
 * Defaults required by all ad scripts
 */
define('defaultSettings',[],function(){

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
define('utils/isObject',[],function(){

  /**
   * Checks if argument is an Object.
   * @param {*} a The data type to check.
   * @return {Boolean} true if argument is Object, false otherwise.
   */
  return function(a){
    return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
  };

});
define('utils/extend',['utils/isObject'], function(isObject){

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
define('utils/isArray',[],function(){

  /**
   * Checks if argument is an Array.
   * @param {*} a The data type to check.
   * @return {Boolean} true if argument is Array, false otherwise.
   */
  return function(a){
    return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Array]';
  };

});
define('utils/merge',['utils/isArray'], function(isArray){

  /**
   * Merges and extends an object of arrays into another.
   * @param {Object} originalArrays Object to be extended (the defaults).
   * @param {Object} newArrays Object to be merged into the default Object, extending existing
   *    keys, or creating new ones that didn't previously exist
   * @return {Object} The merged Object containing arrays assigned to keys.
   */
  return function(originalArrays, newArrays){
    for(var key in newArrays){
      if(newArrays.hasOwnProperty(key)){
        if(!originalArrays.hasOwnProperty(key)){
          originalArrays[key] = [];
        } else {
          originalArrays[key] = isArray(originalArrays[key]) ? originalArrays[key] : [originalArrays[key]];
        }
        newArrays[key] = isArray(newArrays[key]) ? newArrays[key] : [newArrays[key]];
        originalArrays[key] = originalArrays[key].concat(newArrays[key]);
      }
    }
    return originalArrays;
  };

});
define('utils/keyvalueIterator',['utils/isArray', 'utils/isObject'], function(isArray, isObject){

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
define('utils/addKeyvalues',['utils/isArray'], function(isArray){

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
/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
define('Ad',[
  'utils/extend',
  'utils/merge',
  'utils/isArray',
  'utils/keyvalueIterator',
  'utils/addKeyvalues'
], function(extend, merge, isArray, keyvalueIterator, addKeyvalues){

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

    //interstitial logic is slightly different
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

    overrides: {
      //placeholder
    },

    overridesExec: function(){
      var key, check, r;
      for(key in this.overrides){
        if(this.overrides.hasOwnProperty(key) && this.config[key] && this.overrides[key][this.config[key]]){
          this.overrides[key][this.config[key]].call(this);
        }
      }
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

    merge: function(obj){
      this.keyvaluesConfig = merge(this.keyvaluesConfig, obj);
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

    slugDisplay: function(opt_display){
      var display = opt_display !== false ? 'block' : 'none';
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
        if(this.container){
          this.slugDisplay(true);
          if(!this.config.hardcode){
            this.slot = this.buildGPTSlot();
            addKeyvalues(this.keyvalues, this.slot);
            googletag.display(this.container.id);
          } else {
            this.container.innerHTML = this.config.hardcode;
          }
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
/**
 * this Initial setup
 */
define('gptConfig',[
  'utils/extend',
  'utils/merge',
  'utils/keyvalueIterator',
  'utils/addKeyvalues',
  'utils/isObject'
], function(extend, merge, keyvalueIterator, addKeyvalues, isObject){

  return {

    exec: function(config){
      this.config = extend({
        async: true,
        sra: true,
        keyvaluesConfig: false
      }, config);

      this.pubservice = googletag.pubads();

      if(isObject(this.config.keyvaluesConfig)){
        this.keyvaluesConfig = merge(this.keyvaluesConfig, this.config.keyvaluesConfig);
      }

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
define('utils/urlCheck',[],function(){

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
define('utils/estNowWithYear',[],function(){

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
/**
 * Checks and builds an ad template of open spots on the current page
 */
define('utils/templateBuilder',[
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
define('utils/wp_meta_data',[],function(){
  return window.wp_meta_data || {};
});
define('utils/flags',[
  'utils/wp_meta_data'
], function(wp_meta_data){

  return {
    allAds: (/allads/i.test(location.search)),

    debug: (/debugadcode/i.test(location.search)),

    front: (function(){
      if(wp_meta_data.contentType) {
        return wp_meta_data.contentType[0] === 'front' || wp_meta_data.contentType === 'front';
      }
      if(/^homepage/.test(commercialNode)){
        return true;
      }
      //non-methode pages:
      return window.commercialPageType && window.commercialPageType === 'front' ? true : false;
    })(),

    no_interstitials: (/no_interstitials/i.test(location.search))

  };

});
define('utils/getCookie',[],function(){

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
define('utils/setCookie',[],function(){

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
define('utils/showInterstitial',[
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
/**
 * Template of ad flights and available ad spots on slate.com (desktop)
 */

define('slate/config',[],function(){

  return {
    flights: {
      defaults: {
        what: [
          '1x1',
          '150x29',
          '264x90',
          '400x140',
          'bigbox',
          'leaderboard',
          'leftflex',
          'midarticleflex',
          'rightflex',
          'skyscraper',
          'toolbar'
        ]
      },
      homepage_defaults: {
        what: ['!leaderboard', 'tiffanytile'],
        where: ['homepage']
      },
      //20280-CD
      lb_2_behold_blog: {
        what: ['leaderboard_2'],
        where: ['blogs/behold']
      },
      //chris schieffer email 10/5/12
      mini_bb: {
        what: ['bigbox*'],
        where: ['life/mini']
      },
      ge_pushdown: {
        what: ['pushdown'],
        where: ['homepage'],
        when: ['201304240000/201304242359']
      }
    },

    adTypes: {
      '1x1': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['onebyone'] } },
      '120x240bottom': { 'size' : [[120,240]], 'keyvalues' : { 'ad' : ['120x240'] } },
      '120x240top': { 'size' : [[120,240]], 'keyvalues' : { 'ad' : ['120x240'] } },
      '120x30': { 'size' : [[120,30]], 'keyvalues' : { 'ad' : ['120x30'] } },
      '120x60': { 'size' : [[120,60]], 'keyvalues' : { 'ad' : ['120x60'] } },
      '120x90': { 'size' : [[120,90]], 'keyvalues' : { 'ad' : ['120x90'] } },
      '150x29': { 'size' : [[150,29]], 'keyvalues' : { 'ad' : ['150x29'] } },
      '167x115': { 'size' : [[167,115]], 'keyvalues' : { 'ad' : ['167x115'] } },
      '264x90': { 'size' : [[264,90]], 'keyvalues' : { 'ad' : ['264x90'] } },
      '336x60': { 'size' : [[336,60]], 'keyvalues' : { 'ad' : ['336x60'] } },
      '336x90': { 'size' : [[336,90]], 'keyvalues' : { 'ad' : ['336x90'] } },
      '400x140': { 'size' : [[400,140]], 'keyvalues' : { 'ad' : ['400x140'] } },
      '468x60': { 'size' : [[468,60]], 'keyvalues' : { 'ad' : ['468x60'] } },
      '88x31': { 'size' : [[88,31]], 'keyvalues' : { 'ad' : ['88x31'] } },
      'agoogleaday': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['agoogleaday'] } },
      'bigad': { 'size' : [[1,1]] },
      'bigbox': { 'size' : [[300,250]], 'keyvalues' : { 'ad' : ['bb'] } },
      'comment': { 'size' : [[120,30]], 'keyvalues' : { 'ad' : ['comment'] } },
      'customcover': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['customcover'] } },
      'featurebar': { 'size' : [[446,33],[468,60]], 'keyvalues' : { 'ad' : ['fb'] } },
      'flip': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['flip'] } },
      'hive_textlinks': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['hive_textlinks'] } },
      'interstitial': { 'size': [['N/A']], 'keyvalues': { 'ad': ['interstitial'] } },
      'leaderboard': { 'size' : [[728,90]], 'keyvalues' : { 'ad' : ['lb'] } },
      'leftflex': { 'size' : [[160,600],[336,850],[300,250]], 'keyvalues' : { 'ad' : ['ss','hp','bb'] } },
      'midarticleflex': { 'size' : [[446,33],[300,250]], 'keyvalues' : { 'ad' : ['fb','bb'] } },
      'meebo': { 'size' : [[55,21]], 'keyvalues' : { 'ad' : ['meebo'] } },
      'mostread': { 'size' : [[336,54],[336,90]], 'keyvalues' : { 'ad' : ['mostread'] } },
      'pushdown': { 'size' : [[1,1]] },
      'rightflex': { 'size' : [[300,250],[160,600],[336,850]], 'keyvalues' : { 'ad' : ['ss','hp','bb'] } },
      'skyscraper': { 'size' : [[160,600]], 'keyvalues' : { 'ad' : ['ss'] } },
      'sponsor': { 'size' : [[88,31]], 'keyvalues' : { 'ad' : ['sponsor'] } },
      'tiffanytile': { 'size' : [[264,90]], 'keyvalues' : { 'ad' : ['tiff'] } },
      'toolbar' : { 'size' : [[120,60]], 'keyvalues' : { 'ad' : ['120x60'] } },
      'tooltile': { 'size' : [[120,20],[120,30],[180,31],[70,100]], 'keyvalues' : { 'ad' : ['toolbox_tile'] } },
      'twitter': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['twitter'] } }
    }
  };

});
define('utils/contentTypes',[],function(){
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
define('utils/keywords',['utils/isArray', 'utils/wp_meta_data'], function(isArray, wp_meta_data){

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
define('utils/wordMatch',['utils/isArray'], function(isArray){

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
define('keyvalues/config/exclusions',[
  'utils/flags',
  'utils/keywords',
  'utils/wordMatch'
], function(flags, keywords, wordMatch){

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

    if(!flags.front) {
      for(key in obj) {
        if(obj.hasOwnProperty(key) && wordMatch(obj[key], keywords)) {
          rv.push(key);
        }
      }
    }

    return rv;
  };

});
define('keyvalues/config/front',['utils/flags'], function(flags){

  return function(){
    return flags.front ? ['y'] : ['n'];
  };

});
define('keyvalues/config/kw',['utils/urlCheck'], function(urlCheck){

  return function(){
    var param = urlCheck('test_ads', { type: 'variable' });
    return param ? ['test_' + param] : false;
  };

});
define('keyvalues/config/pageId',['utils/wp_meta_data'], function(wp_meta_data){

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
define('keyvalues/config/poe',[
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
define('keyvalues/config/ref',[],function(){

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
define('keyvalues/config/rs',['utils/getCookie'], function(getCookie){

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
/**
 * Dynamically extends commercialNode
 */
define('utils/zoneBuilder',['utils/wp_meta_data', 'utils/contentTypes'], function(wp_meta_data, contentTypes){

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
define('keyvalues/config/u',[
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
define('keyvalues/desktop',[
  'keyvalues/config/exclusions',
  'keyvalues/config/front',
  'keyvalues/config/kw',
  'keyvalues/config/pageId',
  'keyvalues/config/poe',
  'keyvalues/config/ref',
  'keyvalues/config/rs',
  'keyvalues/config/u'
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
/**
* Extends universal desktop, page level keyvalues with slate desktop specific keyvalues
*/
define('slate/keyvalues',[
  'utils/merge',
  'utils/contentTypes',
  'utils/wp_meta_data',
  'keyvalues/desktop'
], function(merge, contentTypes, wp_meta_data, kvs){

  return merge(kvs, {

    articleId: [
      function() {
        var href = location.href.split(/\?/)[0].split('/'),
          title = href[href.length - 1].split(/\..*?\.htm/),
          len, i, articleId = '';

        if (title[0]) {
          title = title[0];
          len = title.length;
          if (len > 30) {
            title = title.split('_');
            for (i = 0; i < len; i++) {
              if (title[i]) {
                articleId = articleId + title[i].slice(0, 1);
              }
            }
          } else {
            articleId = title;
          }
        }
        return articleId;
      }
    ],

    crtg_content: [
      function() {
        var vals, temp, l, str = window.crtg_content, rv = {};
        if(str){
          vals = str.split(';');
          l = vals.length;
          while(l--){
            temp = vals[l].split('=');
            if(temp[0] && temp[1]){
              rv[temp[0]] = [temp[1]];
            }
          }
        }
        return rv;
      }
    ],

    amazon: [
      function() {
        return document.amzn_args || window.amzn_args || false;
      }
    ],

    page: [
      function() {
        if (wp_meta_data.contentType && contentTypes[wp_meta_data.contentType[0]]) {
          return [contentTypes[wp_meta_data.contentType[0]]];
        }
        return commercialNode !== 'homepage' ? ['article'] : ['front'];
      }
    ],

    dept: [
      function(){
        return window.PStax ? [window.PStax] : [];
      }
    ]

  });

});
define('utils/reload',['utils/urlCheck'], function(urlCheck){
  return urlCheck('reload', { type: 'variable' }) === 'true';
});
/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define('slate/overrides',['utils/reload'], function(reload){

  /**
   * Object of checks for overrides
   */
  return {
    pos: {
      leaderboard: function(){
        if (this.config.where === "homepage") {
          this.config.where += '/lb' + (reload ? 'refresh' : '');
        }
      },
      rightflex: function() {
        if (this.config.where === "homepage") {
          console.log(this, this.config)
          this.config.where += '/hp' + (reload ? 'refresh' : '');
        }
      }
    },
    where: {

    }
  };

});
define('slate/galleryRefresh',[],function(){
  return {
    count: 0,
    picViews : 5,
    refresh: function () {
      this.count++;
      if(this.count % this.picViews === 0){
        placeAd2(commercialNode, 'leaderboard', '', '');
        placeAd2(commercialNode, 'bigbox', '', '');
      }
    }
  };
});
/**
 * slate.com site specific ad script (desktop)
 */
define('siteScript',[

  'defaultSettings',
  'Ad',
  'gptConfig',
  'utils/templateBuilder',
  'utils/extend',
  'utils/merge',
  'utils/showInterstitial',
  'utils/flags',
  'slate/config',
  'slate/keyvalues',
  'slate/overrides',
  'slate/galleryRefresh'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  templateBuilder,
  extend,
  merge,
  showInterstitial,
  flags,
  config,
  kvs,
  overrides,
  galleryRefresh

){

  //extend or add keyvalues at the ad level
  //each key can accept a function, or an array of functions
  merge(Ad.prototype.keyvaluesConfig, {
    ad: function(){
      if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
        return config.adTypes[this.config.what].keyvalues.ad;
      }
    }
  });

  //Custom flight templates that require additional conditionals
  config.flights = extend({
    interstitial: {
      what: ['interstitial'],
      test: [showInterstitial && !flags.front]
    }
  }, config.flights);

  //overrides config
  extend(Ad.prototype.overrides, overrides);

  //ad refresh on gallery pages
  window.wpniAds = window.wpniAds || {};
  window.wpniAds.gallery = galleryRefresh;

  return extend(defaultSettings, {

    constants: {
      dfpSite: '/701/slate.',
      domain: 'slate.com'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: true,
      keyvaluesConfig: kvs
    }),

    flags: flags,

    config: config,

    //determine open ad spots
    flights: templateBuilder.exec(config.flights)

  });
});
define('utils/getScript',[],function(){

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
/*global placeAd2:true, placeAd2Queue */
/*jshint indent:2*/

// load dependencies:
// "siteScript" is defined in the site specific build file (eg: build/slate.js)
require(['gpt', 'siteScript', 'utils/getScript'], function (googletag, wpAd, getScript){

  var queue = placeAd2.queue || false;

  if(wpAd.flags.debug){
    getScript('js/debug.js');
    try{console.log('placeAd2 queue:', queue);}catch(e){}
  }

  // add to placeAd2 queue
  placeAd2(commercialNode, 'interstitial', false, '');

  googletag.cmd.push(function(){

    placeAd2 = function(where, what, del, onTheFly){

      var pos = what,
        posOverride = false,
        posArray,
        ad;

      // determine pos value and potential posOverride
      if(/\|/.test(what)){
        posArray = what.split(/\|/);
        what = posArray[0];
        posOverride = posArray[1];
        pos = posArray.join('_');
      }

      // if the ad type is legit, open and hasn't already been built/rendered on the page
      if(wpAd.config.adTypes[what] &&
         ((wpAd.flights && wpAd.flights[pos] || wpAd.flights[what + '*']) || wpAd.flags.allAds)){

        if(!wpAd.adsOnPage[pos]){

          // build and store our new ad
          ad = new wpAd.Ad({
            templateSettings: wpAd.config.adTypes[what],
            dfpSite: wpAd.constants.dfpSite,
            where: window.commercialNode,
            size: wpAd.config.adTypes[what].size,
            what: what,
            pos: pos,
            posOverride: posOverride,
            hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false,
            onTheFly: onTheFly
          });

          // overrides (the new hackbin)
          //if(wpAd.overrides){
          //  ad = wpAd.overrides.exec(ad);
          //}

          ad.overridesExec();

          // display the gpt ad
          ad.render();

          // store for debugging
          wpAd.adsOnPage[pos] = ad;

        } else{
          // refresh if ad/spot already rendered
          wpAd.adsOnPage[pos].refresh();
        }

      } else {
        wpAd.adsDisabledOnPage[pos] = true;
      }

      // always need to create this queue
      wpAd.debugQueue.push(pos);

    };

    // build and display queued up ads from previous placeAd2 calls
    callPlaceAd2Queue(queue);

  });

  // expose wpAd to the window for debugging + external code to access/build off of.
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
};
define("main", function(){});
}());