/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define(['utils/reload', 'utils/merge'], function(reload, merge){

  /**
   * Object of checks for overrides
   */
  return {
    pos: {
      leaderboard: function(){
        if (this.config.where === "homepage") {
          this.config.where += '/lb' + (reload ? 'refresh' : '');
        }

        //add custom keyvalues like this
        /*this.addKeyvalues({
          someCustomKV: ['im_a_leaderboard']
        });*/

      },
      rightflex: function() {
        if (this.config.where === "homepage") {
          this.config.where += '/hp' + (reload ? 'refresh' : '');
        }
      }
    },
    where: {

    }
  };

});