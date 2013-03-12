/**
 *  Debug info for adops
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){
    define('debug', ['utils'], function(utils){

      var debug = {

        init: function(){
          var l = wpAd.debugQueue.length, i = 0;
          for(i;i<l;i++){
            debug.exec.call(this, wpAd.debugQueue[i]);
          }
          wpAd.debugQueue = { push: debug.exec };
        },

        exec: function(ad){
          debug.buildDebugBox(ad);
          /*try{
            w.console.log('RENDERED AD:\n', ad.config.pos, '\n', ad);
          }catch(e){}*/
        },

        buildDebugBox: function(ad){
          if(ad.container){
            var box = d.createElement('div');
            box.setAttribute('class', 'debug-box');

            //will probably just end up writing a stylesheet for this mess:
            box.style.width = '300px';
            box.style.backgroundColor = '#ffc700';
            box.style.border = '1px solid #000';
            box.style.color = '#000';
            box.style.fontFamily = 'sans-serif';
            box.style.fontSize = '12px';
            box.style.position = 'absolute';
            box.style.textAlign = 'left';
            box.style.top = '0';
            box.style.zIndex = '9999999999';
            box.style.padding = '10px';
            box.style.lineHeight = '20px';
            box.style.boxShadow = '0 0 10px 0px #333';

            box.innerHTML = debug.content(ad);
            ad.container.style.position = 'relative';
            ad.container.insertBefore(box, ad.container.firstChild);
          }
        },

        where: function(ad){
          return '<b>Where:</b><br />' + ad.fullGPTSite + '<br /><br />';
        },

        keyvalueList: function(ad){
          var list = '<div style="font-weight:bold;">Keyvalues</div>',
            keyvalues = utils.extend(wpAd.gpt_config.keyvalues, ad.keyvalues),
            key;

          for(key in keyvalues){
            list += '<div><b>- ' + key + ': </b>' + keyvalues[key] + '</div>';
          }

          return list;
        },

        content: function(ad){
          return debug.where(ad) + debug.keyvalueList(ad);
        }

      };

      return debug;

    });
  }

})(window, document, define);