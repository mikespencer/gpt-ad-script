/**
 * Overrides for standard configuration of ad spots for unique circumstances on slate.com (desktop)
 */
(function(define){

  'use strict';

  define(['overrides'], function(overrides){

    /**
     * Object of checks for overrides
     * keys of check functions will be evaluated as Regular Expressions.
     * EG: key could = '^politics$'
     */
    overrides.checks = {
      pos: {
        'leaderboard$': function(){
          this.keyvalues.lb_test_kv = this.keyvalues.lb_test_kv || [];
          this.keyvalues.lb_test_kv.push('true');
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