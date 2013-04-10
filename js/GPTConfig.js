/**
 * this Initial setup
 */
define([
  'utils/extend',
  'utils/keyvalueIterator',
  'utils/addKeyvalues'
], function(extend, keyvalueIterator, addKeyvalues){

  return {

    exec: function(config){
      this.config = extend({
        async: true,
        sra: true
      }, config);

      this.pubservice = googletag.pubads();

      this.keyvalues = keyvalueIterator(this.keyvaluesConfig, this);
      addKeyvalues(this.keyvalues, this.pubservice);

      if(this.config.sra){
        this.pubservice.enableSingleRequest();
      } else{
        this.pubservice.enableAsyncRendering();
      }

      googletag.enableServices();
    },

    init: function(config){
      var self = this;
      googletag.cmd.push(function(){
        self.exec.call(self, config);
      });
      return this;
    },

    /**
     * Placeholder. Gets added in site script
     */
    keyvaluesConfig: {}

  };

});