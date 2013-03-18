/**
 * Dynamically extends commercialNode
 */
(function(w, d, define){

  'use strict';

  define(['wp_meta_data'], function(wp_meta_data){

    var commercialNode = w.commercialNode || 'politics';

    return {

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

})(window, document, window.define);