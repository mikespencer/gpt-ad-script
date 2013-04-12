/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define(['overrides', 'utils/reload'], function(overrides, reload){

  /**
   * Object of checks for overrides
   */
  overrides.checks = {
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

  return overrides;

});