/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define(['utils/reload'], function(reload){

  /**
   * Object of checks for overrides
   */
  return {
    pos: {
      leaderboard: function(){
        if (this.config.where === "homepage") {
          this.config.where += '/lb' + (reload ? 'refresh' : '');
        }
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