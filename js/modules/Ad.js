/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
(function(w, d, define){

  'use strict';

  define([
    'utils/extend',
    'utils/keyvalueIterator',
    'utils/addKeyvalues'
  ], function(extend, keyvalueIterator, addKeyvalues){

    function Ad(config){
      this.config = extend({
        'dfpSite': '/701/wpni.',
        'where': undefined,
        'size': null,
        'what': null,
        'pos': false,
        'posOverride': false,
        'interstitial': false
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
        pos: function(){
          return [this.config.pos];
        },
        ad: function(){
          return false;
        },
        dfpcomp: function(){
          return w.dfpcomp ? [w.dfpcomp] : false;
        }
      },

      getSlug: function(){
        this.config.slug = d.getElementById('slug_' + this.config.pos);
        this.config.wpni_adi = d.getElementById('wpni_adi_' + this.config.pos);
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

      hardcode: function(){
        googletag.content().setContent(this.slot, this.hardcode);
      },

      addInterstitialDiv: function(){
        var s = d.createElement('div');
        s.id = 'slug_' + this.config.pos;
        s.style.display = 'none';
        d.body.insertBefore(s, d.body.firstChild);
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

})(window, document, window.define);