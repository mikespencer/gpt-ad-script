/**
 * this Initial setup
 */
define(['utils'], function(utils){

  return {

    exec: function(config){
      this.config = utils.extend({
        sra: false,
        keyvaluesConfig: false
      }, config);

      this.pubservice = googletag.pubads();

      if(utils.isObject(this.config.keyvaluesConfig)){
        this.keyvaluesConfig = utils.merge(this.keyvaluesConfig, this.config.keyvaluesConfig);
      }

      this.keyvalues = utils.keyvalueIterator(this.keyvaluesConfig, this);
      utils.setTargeting(this.keyvalues, this.pubservice);

      if(this.config.sra){
        this.pubservice.enableSingleRequest();
      } else{
        this.pubservice.enableAsyncRendering();
      }
      if (navigator.geolocation && utils.urlCheck('?locationsniff')) {
        function getPosition(location) {
          var lat = location.coords.latitude,
              lng = location.coords.longitude;
          this.pubservice.setLocation(latitude, longitude);
        }
        navigator.geolocation.getCurrentPosition(getPosition);
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
