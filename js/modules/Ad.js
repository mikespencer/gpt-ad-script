/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){

    define('Ad', ['utils.core'], function(utils){

      function Ad(config){
        this.config = utils.extend({
          'dfpSite': '/701/wpni.',
          'where': undefined,
          'size': null,
          'what': null,
          'pos': false,
          'posOverride': false
        }, config, true);

        this.keyvalues = this.buildKeyvalues();
      }

      Ad.prototype = {
        constructor: Ad,

        getSlug: function(){
          this.config.slug = d.getElementById('slug_' + this.config.pos);
          this.config.wpni_adi = d.getElementById('wpni_adi_' + this.config.pos);
        },

        getContainer: function(){
          return this.config.wpni_adi || this.config.slug;
        },

        buildKeyvalues: function(){
          return utils.keyvalueIterator(this.keyvaluesConfig, this);
        },

        getKeyvalues: function(){
          return this.keyvalues;
        },

        hardcode: function(){
          googletag.content().setContent(this.slot, this.hardcode);
        },

        keyvaluesConfig: {
          pos: function(){
            return this.config.pos;
          }
        },

        buildGPTSlot: function(){
          this.fullGPTSite = this.config.dfpSite + this.config.where;
          return googletag.defineSlot(this.fullGPTSite, this.config.size, this.container.id)
            .addService(googletag.pubads());
        },

        getSlot: function(){
          return this.slot;
        },

        addKeyvalue: function(){
          if(typeof arguments[0] === 'object'){
            var map = arguments[0], key;
            for(key in map){
              if(map.hasOwnProperty(key)){
                this.slot.setTargeting(key, (typeof map[key] === 'object' ? map[key] : [map[key]]));
              }
            }
          } else if(arguments.length === 2){
            this.slot.setTargeting(arguments[0], (typeof arguments[1] === 'object' ? arguments[1] : [arguments[1]]));
          }
          return this;
        },

        render: function(){
          if(!this.slot){

            this.getSlug();
            this.container = this.getContainer();
            this.slot = this.buildGPTSlot();

            this.addKeyvalue(this.keyvalues);

            if(this.config.slug){
              this.config.slug.style.display = 'block';
            }
            if(this.config.wpni_adi){
              this.config.wpni_adi.style.display = 'block';
            }

            googletag.display(this.container.id);

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
  }

})(window, document, window.define);