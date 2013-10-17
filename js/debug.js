/**
 * Debug info for adops
 * For now this will do for basic dubug functionality
 */
var wpAd = wpAd || {};
(function(w, d, $){

  'use strict';

  if(!$){
    wpAd.utils.log('$ is ', $);
    return false;
  }

  var jqui = 'http://js.washingtonpost.com/wp-srv/ad/loaders/latest/js/lib/jquery-ui.min.js';

  $.ajax({
    url: jqui,
    cache: true,
    dataType: 'script',
    crossDomain: true,
    timeout: 4000,
    success: function(){
      init();
    },
    error: function(err){
      wpAd.utils.log('jQuery UI failed to load', err);
    }
  });

  function init(){
    var queue = wpAd.debugQueue || [];
    wpAd.debugQueue = debugSetup().init(queue);
  }

  function debugSetup(){

    var debug = {

      debugBoxes: {},

      cssURL: (/localhost/i.test(d.domain) ? '' : 'http://css.wpdigital.net/wp-srv/ad/loaders/latest/') + 'css/debug.css',

      init: function(queue){
        var l = queue.length,
          i = 0;

        var link = d.createElement('link');
        link.href = debug.cssURL;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        d.body.insertBefore(link, d.body.firstChild);

        debug.$debugConsole = $(debug.buildDebugConsole()).prependTo('body');

        $('.console-button', debug.$debugConsole).on('click', function(){
          var oldHeight = $('div.ad-debug-console').outerHeight(),
              height, offset;

          $('span', this).toggleClass('hidden');
          $('div.ad-debug-console-inner').toggleClass('hidden');

          height = $('div.ad-debug-console').outerHeight();
          offset = height > oldHeight ? height : 0 - oldHeight;

          $('div.ad-debug-box').each(function(){
            var $this = $(this),
                csstop = $this.offset().top;
            $this.css({
              top: (csstop + offset) + 'px'
            });
          });
        });

        $(document).on('keydown.wpAd', function(e){
          //if ctrl+f9 pressed
          if(e.ctrlKey && e.which === 120){
            $('.ad-debug-box, .ad-debug-console').toggleClass('hidden');
          }
        });

        for(i;i<l;i++){
          debug.exec(queue[i]);
        }

        if(window.localStorage){
          window.localStorage.setItem('adops_debug_enabled', true);
        }

        return { push: debug.exec };
      },

      exec: function(pos){

        if(wpAd.adsOnPage[pos]){
          var ad = wpAd.adsOnPage[pos];
          if(ad.container){

            if(debug.debugBoxes[pos]){
              debug.removeBox(debug.debugBoxes[pos]);
            }

            debug.debugBoxes[pos] = debug.buildDebugBox(ad);

            //a little hacky, but prevents any debug box overlaying the console
            var top = $(ad.container).offset().top;
            top = top < 60 ? 60 : top;

            $(debug.debugBoxes[pos]).css({
              position: 'absolute',
              top: top + 'px',
              left: $(ad.container).offset().left + 'px'
            }).draggable({
              handle: 'div.ad-debug-handle',
              stack: 'div.ad-debug-box',
              start: function(){
                $(this).addClass('dragging');
              },
              stop: function(){
                $(this).removeClass('dragging');
              }
            });

            wpAd.utils.log('RENDERED:', pos, ad);
            $('<a href="#' + pos + '" class="ad-console-box green">' +
              debug.debugConsoleAdContents('Rendered', ad, pos) +
            '</a>').on('click', function(e){
              var $this = $(this),
                  name = $this.attr('href').replace('#',''),
                  $wpni_adi = $('#wpni_adi_' + name),
                  $slug = $('#slug_' + name),
                  $target = $wpni_adi.length ? $wpni_adi : $slug,
                  i;
              $target.addClass('ad-debug-highlight-ad');
              i = setTimeout(function(){
                $target.removeClass('ad-debug-highlight-ad');
              }, 1750);
            }).appendTo('.ad-debug-console-inner');

            ($('#wpni_adi_' + pos).length ? $('#wpni_adi_' + pos) : $('#slug_' + pos)).prepend('<a name="' + pos + '"></a>');

          } else {
            wpAd.utils.log('Could not find container for', pos, ad);
            $('.ad-debug-console-inner').append('<div class="ad-console-box orange">' +
              debug.debugConsoleAdContents('UNIT DID NOT RENDER - Could not find element matching #slug_' + pos + ' or #wpni_adi_' + pos + ' for', ad, pos) +
            '</div>');
          }
        } else{
          wpAd.utils.log('DISABLED:', pos);
          $('.ad-debug-console-inner').append('<div class="ad-console-box grey">' +
            debug.debugConsoleAdContents('Disabled', false, pos) +
          '</div>');
        }
      },

      buildDebugConsole: function(){
        return '<div class="ad-debug-console">' +
          '<div class="console-button">' +
            '<div class="ad-debug-console-title pad5">AdOps Debug Console</div>' +
            '<div class="ad-debug-console-hide ad-debug-bold pad5">' +
              '<span class="show blue">-- Show --</span>' +
              '<span class="hide blue hidden">-- Hide --</span>' +
            '</div>' +
          '</div>' +
          '<div class="ad-debug-console-inner hidden"></div>' +
        '</div>';
      },

      debugConsoleAdContents: function(verb, ad, pos){
        var code = '<div>' + (verb ? '<span class="ad-debug-bold">' + verb + ': </span>' : '') + pos + '</div>';
        if(ad){
          code += '<div><span class="ad-debug-bold">Sizes: </span>' + debug.sizesToString(ad) + '</div>';
          code += '<div><span class="ad-debug-bold">Template: </span>' + debug.getTemplateId(ad) + '</div>';
        }
        return code;
      },

      removeBox: function(box){
        $(box).remove();
      },

      getTemplateId: function(ad){
        var t = (w.wpAd.flights[ad.config.pos] || wpAd.flights[ad.config.what + '*']);
        return t ? t.id : 'unknown';
      },

      buildDebugBox: function(ad){
        return $(document.createElement('div')).addClass('ad-debug-box').html(debug.content(ad)).prependTo('body')[0];
      },

      dragHandles: function(_class){
        return '<div class="ad-debug-handle top left"></div>' +
          '<div class="ad-debug-handle top right"></div>' +
          '<div class="ad-debug-handle bottom left"></div>' +
          '<div class="ad-debug-handle bottom right"></div>';
      },

      title: function(ad){
        return '<div class="ad-debug-section">' +
          '<div class="ad-debug-bold large">' + ad.config.pos + '</div>' +
          '<div>Template: ' + debug.getTemplateId(ad) + '</div>' +
        '</div>';
      },

      sizesToString: function(ad){
        var sizes = [],
          l = wpAd.config.adTypes[ad.config.what].size.length,
          i = 0;
        for(i;i<l;i++){
          sizes.push(wpAd.config.adTypes[ad.config.what].size[i].join('x'));
        }
        return sizes.join(', ');
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
        return ad.fullGPTSite ? '<div class="ad-debug-section">' +
          '<div class="ad-debug-bold">Where:</div>' +
          '<div>' + ad.fullGPTSite + '</div>' +
        '</div>' : '';
      },

      keyvalueList: function(ad){
        var list = '<div class="ad-debug-section">',

          //important to use "clone", as "extend" will permanently overwrite first argument
          //keyvalues = extend(clone(wpAd.gptConfig.keyvalues), ad.keyvalues),
          keyvalues = $.extend(clone(wpAd.gptConfig.keyvalues), ad.keyvalues),
          sortedKeys = [],
          key, l, i;


        if(ad.keyvalues){

          list += '<div class="ad-debug-bold">Keyvalues: </div>' +
              '<ul>';

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

          list += '</ul></div>';

        //hardcoded ad call support:
        } else if(ad.config.hardcode){
          list += '<div class="ad-debug-bold">Hardcoded:</div>' +
            '<textarea cols="36" rows="12">' + ad.config.hardcode.toString() + '</textarea>';
        }

        return list;
      },

      content: function(ad){
        return debug.title(ad) + debug.where(ad) + debug.sizes(ad) + debug.keyvalueList(ad) + debug.dragHandles();
      }

    };

    return debug;
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

})(window, document, (wpAd.$ || window.jQuery));
