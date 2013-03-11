/*
  THIS DOES NOT WORK YET
*/
(function(w, d, define){

  'use strict';

  function Interstitial(config){
    this.config = config;

    this.addContainer();

    this.slot = this.defineSlot();
    this.slot.setTargeting('kw', 'test_interstitialtemplate');
    this.render();
  }

  Interstitial.prototype = {
    constructor: Interstitial,

    defineSlot: function(){
      return googletag.defineOutOfPageSlot(this.config.dfpSite + this.config.where, this.container.id)
      .addService(googletag.pubads());
    },

    addContainer: function(){
      this.container = d.createElement('div');
      this.container.id = this.config.id || 'slug_outofpage';
      this.container.style.display = 'none';
      this.container.style.width = '0';
      this.container.style.height = '0';
      d.body.insertBefore(this.container, d.body.firstChild);
    },

    render: function(){
      googletag.display(this.container.id);
    }

  };

  if(typeof define === 'function'){
    define('Interstitial', function(){
      return Interstitial;
    });
  }

})(window, document, define);