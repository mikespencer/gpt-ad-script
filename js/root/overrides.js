/**
 * Overrides for standard configuration of ad spots for unique circumstances on root.com (desktop)
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
      	
      },
      where: {
		'homepage': function() {
			if (reload) {
				this.config.where += '/refresh';
			};
		}
      }
    };

    return overrides;

  });

})(window.define);