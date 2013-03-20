/**
 * Debug info for adops
 * For now this will do for basic dubug functionality, but this could do with a major cleanup before launch
 */
(function(w, d, define){

  'use strict';

  define([
    'jqueryUI',
    'utils/addCSS',
    'utils/extend',
    'utils/clone'
  ], function($, addCSS, extend, clone){

    return {

      cssURL: 'css/debug.css',

      init: function(){
        var l = wpAd.debugQueue.length,
          i = 0;

        addCSS(this.cssURL);

        for(i;i<l;i++){
          this.exec.call(this, wpAd.debugQueue[i]);
        }
        wpAd.debugQueue = { push: this.exec };
      },

      exec: function(pos){
        if(wpAd.adsOnPage[pos]){
          var ad = wpAd.adsOnPage[pos];
          if(ad.container){
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

            this.log('--ADOPS DEBUG-- RENDERED:', pos, ad);

          } else {
            this.log('--ADOPS DEBUG-- Could not find container for', pos, ad);
          }
        } else{
          this.log('--ADOPS DEBUG-- DISABLED:', pos);
        }
      },

      log: function(){
        try{
          if(w.console){console.log.apply(console, arguments);}
        }catch(e){}
      },

      getTemplateId: function(ad){
        var t = (w.wpAd.flights[ad.config.pos] || wpAd.flights[ad.config.what + '*']);
        return t ? t.id : 'unknown';
      },

      buildDebugBox: function(ad){
        return $(d.createElement('div')).addClass('ad-debug-box').html(this.content(ad)).prependTo('body')[0];
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

  });

})(window, document, define);