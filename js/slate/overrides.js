/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
(function(define){

  'use strict';

  define(['overrides', 'utils/reload'], function(overrides, reload){

    /**
     * Object of checks for overrides
     * keys of check functions will be evaluated as Regular Expressions.
     * EG: key could = '^politics$'
     */
    overrides.checks = {
      pos: {
        'leaderboard$': function(){
			if (this.config.where === "homepage") {
				this.config.where += '/lb' + (reload ? 'refresh' : '');
			};
        },
		'rightflex$': function() {
			if (this.config.where === "homepage") {
				this.config.where += '/hp' + (reload ? 'refresh' : '');
			};
		}
      },
      where: {
        '^politics$': function(){
          this.config.where += '/front';
        }
      }
    };

    return overrides;

  });

})(window.define);