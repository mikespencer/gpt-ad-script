/**
 * Dynamically extends commercialNode
 */
(function(w, d, define){

  'use strict';

  var commercialNode = w.commercialNode || 'politics',

    wp_meta_data = w.wp_meta_data || {},

    zoneBuilder = {

      contentType: {
        audiostory: 'audio',
        blogstory: 'blog',
        front: 'front',
        graphicstory: 'graphic',
        mediagallery: 'photo',
        panostory: 'pano',
        ugcphotostory: 'ugc',
        videostory: 'video'
      },

      zones: {
        contentType: function(){
          var a = zoneBuilder.getString(wp_meta_data.contentType);
          return a && commercialNode !== 'washingtonpost.com' && zoneBuilder.contentType[a.toLowerCase()] || '';
        },

        contentName: function(){
          return zoneBuilder.getString(wp_meta_data.contentName);
        },

        subsection: function(){
          return zoneBuilder.getString(wp_meta_data.subsection);
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
        var zones = zoneBuilder.zones,
          cn = [zoneBuilder.validate(commercialNode)],
          key, t;
        for(key in zones){
          if(zones.hasOwnProperty(key)){
            t = zoneBuilder.validate(zones[key]());
            if(t){
              cn.push(t);
            }
          }
        }
        zoneBuilder.executed = true;
        return cn.join('/').toLowerCase();
      }

    };

  if(typeof w.define === 'function'){
    w.define('zoneBuilder', function(){
      return zoneBuilder;
    });
  }

})(window, document, window.define);