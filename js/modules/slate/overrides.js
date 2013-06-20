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
      },
      leaderboard: function(){
        if (this.config.where === "homepage") {
          this.config.where += '/lb' + (utils.flags.reload ? 'refresh' : '');
        }

        //add custom keyvalues like this
        /*this.addKeyvalues({
          someCustomKV: ['im_a_leaderboard']
        });*/
      },
      rightflex: function() {
        if (this.config.where === "homepage") {
          this.config.where += '/hp' + (utils.flags.reload ? 'refresh' : '');
        }
      }
    },
    where: {

    }
  };

});