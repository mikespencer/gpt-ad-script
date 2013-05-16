/**
 * this Initial setup
 */
define([
  'utils/extend',
  'utils/merge',
  'utils/keyvalueIterator',
  'utils/setTargeting',
  'utils/isObject'
], function(extend, merge, keyvalueIterator, setTargeting, isObject){

  return {

    exec: function(config){
      this.config = extend({
        async: true,
        sra: true,
        keyvaluesConfig: false
      }, config);

      this.pubservice = googletag.pubads();

      if(isObject(this.config.keyvaluesConfig)){
        this.keyvaluesConfig = merge(this.keyvaluesConfig, this.config.keyvaluesConfig);
      }

      this.keyvalues = keyvalueIterator(this.keyvaluesConfig, this);
      setTargeting(this.keyvalues, this.pubservice);

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