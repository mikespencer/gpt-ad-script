/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define(['utils'], function(utils){

  /**
   * Object of checks for overrides
   */
  return {
    pos: {
      //determines if page gets a full page interstitial
      interstitial: function(){
        if(utils.flags.showInterstitial && !utils.flags.front){
          this.addKeyvalues({
            ad: ['interstitial']
          });
        }
      }
    },
    where: {
      homepage: function(){
        if(utils.flags.reload){
          this.config.where += '/refresh';
        }
      }
    }
  };

});