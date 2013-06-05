/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
define(['utils'], function(utils){

  function Ad(config){
    this.config = utils.extend({
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

    findSlugs: function(){
      this.config.slug = document.getElementById('slug_' + this.config.pos);
      this.config.wpni_adi = document.getElementById('wpni_adi_' + this.config.pos);
    },

    getContainer: function(){
      this.findSlugs();
      return this.config.wpni_adi || this.config.slug;
    },

    buildKeyvalues: function(){
      return utils.keyvalueIterator(this.keyvaluesConfig, this);
    },

    getKeyvalues: function(){
      return this.keyvalues;
    },

    // Use this to add functions to keyvaluesConfig (BEFORE keyvalues are generated via keyvaluesConfig functions)
    addKeyvaluesConfig: function(obj){
      utils.merge(this.keyvaluesConfig, obj);
    },

    // Use this to add keyvalue pairs AFTER keyvaluesConfig functions have executed
    addKeyvalues: function(obj){
      utils.merge(this.keyvalues, obj);
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
        this.container = this.getContainer();
        if(this.container){
          this.slugDisplay(true);
          if(!this.config.hardcode){
            this.overridesExec();
            this.slot = this.buildGPTSlot();
            utils.setTargeting(this.keyvalues, this.slot);
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