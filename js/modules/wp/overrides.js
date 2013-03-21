/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
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
        //if 'pos' of the ad === leaderboard..
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