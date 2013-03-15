/**
 * Debug info for adops
 * For now this will do for basic dubug functionality, but this could do with a major cleanup before launch
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define(['utils', 'jqueryUI'], function(utils, $){

      var debug = {

        cssURL: 'css/debug.css',

        init: function(){
          var l = wpAd.debugQueue.length,
            i = 0;

          utils.addCSS(debug.cssURL);

          for(i;i<l;i++){
            debug.exec.call(this, wpAd.debugQueue[i]);
          }
          wpAd.debugQueue = { push: debug.exec };
        },

        exec: function(ad){
          if(ad.container){
            var box = debug.buildDebugBox(ad);

            try{
              w.console.log('RENDERED AD:\n', ad.config.pos + '\n', ad);
            }catch(e){}

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

          } else {
            try{
              w.console.log('Could not find container for', ad.config.pos);
            }catch(e){}
          }
        },

        getTemplateId: function(ad){
          var t = (w.wpAd.flights[ad.config.pos] || wpAd.flights[ad.config.what + '*']);
          return t ? t.id : 'unknown';
        },

        buildDebugBox: function(ad){
          return $(d.createElement('div')).addClass('ad-debug-box').html(debug.content(ad)).prependTo('body')[0];
        },

        title: function(ad){
          return '<div class="ad-debug-section">' +
            '<div class="ad-debug-bold large">' + ad.config.pos + '</div>' +
            '<div>Template: ' + debug.getTemplateId(ad) + '</div>' +
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

            //important to use "utils.clone", as "utils.extend" will permanently overwrite first arg
            keyvalues = utils.extend(utils.clone(wpAd.gptConfig.keyvalues), ad.keyvalues),
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
          return debug.title(ad) + debug.where(ad) + debug.sizes(ad) + debug.keyvalueList(ad);
        }

      };

      return debug;

    });
  }

})(window, document, define);