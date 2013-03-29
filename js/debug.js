/**
 * Debug info for adops
 * For now this will do for basic dubug functionality, but this could do with a major cleanup before launch
 */
(function(w, d, wpAd){

  'use strict';

  var jq = 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
    jqui = '/js/lib/jquery-ui.min.js';

  if(!w.jQuery){
    getScript(jq, function(){
      getScript(jqui, init);
    });
  } else{
    getScript(jqui, init);
  }

  function init(){
    var queue = wpAd.debugQueue || [];
    wpAd.debugQueue = debug(w.jQuery).init(queue);
  }

  function debug($){

    return {

      cssURL: 'css/debug.css',

      init: function(queue){
        var l = queue.length,
          i = 0;

        //addCSS(this.cssURL);
        var link = d.createElement('link');
        link.href = this.cssURL;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        d.body.insertBefore(link, d.body.firstChild);

        for(i;i<l;i++){
          this.exec.call(this, queue[i]);
        }

        return { push: $.proxy(this.exec, this) };
      },

      exec: function(pos){
        if(wpAd.adsOnPage[pos]){
          var ad = wpAd.adsOnPage[pos];
          if(ad.container){
            console.log(this);
            var box = this.buildDebugBox(ad);

            $(box).css({
              position: 'absolute',
              top: $(ad.container).offset().top + 'px',
              left: $(ad.container).offset().left + 'px'
            }).draggable({
              stack: 'div.ad-debug-box',
              start: function(){
                $(this).addClass('dragging');
              },
              stop: function(){
                $(this).removeClass('dragging');
              }
            });

            this.log('--ADOPS DEBUG--', 'RENDERED:', pos, ad);

          } else {
            this.log('--ADOPS DEBUG--', 'Could not find container for', pos, ad);
          }
        } else{
          this.log('--ADOPS DEBUG--', 'DISABLED:', pos);
        }
      },

      log: function(){
        try{
          if(w.console){
            console.log.apply(console, arguments);
          }
        }catch(e){}
      },

      getTemplateId: function(ad){
        var t = (w.wpAd.flights[ad.config.pos] || wpAd.flights[ad.config.what + '*']);
        return t ? t.id : 'unknown';
      },

      buildDebugBox: function(ad){
        return $(document.createElement('div')).addClass('ad-debug-box').html(this.content(ad)).prependTo('body')[0];
      },

      title: function(ad){
        return '<div class="ad-debug-section">' +
          '<div class="ad-debug-bold large">' + ad.config.pos + '</div>' +
          '<div>Template: ' + this.getTemplateId(ad) + '</div>' +
        '</div>';
      },

      sizes: function(ad){
        var sizes = '',
          l = ad.config.size.length,
          i = 0;
        for(i;i<l;i++){
          sizes += '<li>' + ad.config.size[i].join('x') + '</li>';
        }

        return '<div class="ad-debug-section">' +
          '<div class="ad-debug-bold">Sizes:</div>' +
          '<ul>' + sizes + '</ul>' +
        '</div>';
      },

      where: function(ad){
        return '<div class="ad-debug-section">' +
          '<div class="ad-debug-bold">Where:</div>' +
          '<div>' + ad.fullGPTSite + '</div>' +
        '</div>';
      },

      keyvalueList: function(ad){
        var list = '<div class="ad-debug-section">' +
            '<div class="ad-debug-bold">Keyvalues: </div>' +
              '<ul>',

          //important to use "clone", as "extend" will permanently overwrite first argument
          keyvalues = extend(clone(wpAd.gptConfig.keyvalues), ad.keyvalues),
          sortedKeys = [],
          key, l, i;

        for(key in keyvalues){
          if(keyvalues.hasOwnProperty(key) && keyvalues[key].length){
            sortedKeys.push(key);
          }
        }

        //sort alphabetically, ignoring case
        sortedKeys.sort(function(a, b){
          a = a.toLowerCase();
          b = b.toLowerCase();
          return a < b ? -1 : a > b ? 1 : 0;
        });

        l = sortedKeys.length;

        for(i=0;i<l;i++){
          list += '<li><span class="ad-debug-bold">' + sortedKeys[i] + ': </span>' + keyvalues[sortedKeys[i]].toString().replace(/\,/g, ', ') + '</li>';
        }

        return list + '</ul></div>';
      },

      content: function(ad){
        return this.title(ad) + this.where(ad) + this.sizes(ad) + this.keyvalueList(ad);
      }

    };
  }


  /**
   * HELPER FUNCTIONS:
   */

  function getScript(src, opt_callback){
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
  }

  function isObject(a){
    return typeof a === 'object' && a !== null && Object.prototype.toString.call(a) === '[object Object]';
  }

  function clone(obj) {
    if(!isObject(obj)) {
      return obj;
    }
    var temp = new obj.constructor(),
      key;
    for(key in obj) {
      if(key !== '') {
        temp[key] = clone(obj[key]);
      }
    }
    return temp;
  }

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

})(window, document, wpAd);