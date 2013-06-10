/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
define(['utils'], function(utils){

  /**
   * Object of checks for overrides
   */
  return {
    where: {
      homepage: function(){
        if(utils.flags.reload){
          this.config.where += '/refresh';
        }
      }
    }
  };

});