/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
 */
(function() {

    'use strict';

    define(['overrides'], function(overrides) {

        /**
         * Object of checks for overrides
         * keys of check functions will be evaluated as Regular Expressions.
         * EG: key could = '^politics$'
         */
        overrides.checks = {
            pos: {
                'leaderboard$': function() {
                    this.keyvalues.lb_test_kv = this.keyvalues.lb_test_kv || [];
                    this.keyvalues.lb_test_kv.push('true');
                    if (this.config.where === 'washingtonpost.com') {
                        this.config.where += '/lb';
                    }
                },
                'featrent$': function() {
                    if (window.jquery) {
                        $('#wpni_adi_featrent').css({
                            background: 'none',
                            padding: '0'
                        });
                    }
                },
                '^tiffany_tile$': function() {
                    if (this.config.where === "washingtonpost.com") {
                        this.config.size = ['184x90'];
                    }
                },
                'flex_ss_bb_hp': function() {
                    if (this.config.where === 'lifestyle/home' || this.config.where === 'lifestyle/home/front' || this.config.where === 'lifestyle/home-garden')) {
                    this.config.where += '/flex';
                }
            };
        }, where: {
            '^politics$': function() {
                this.config.where += '/front';
            },
            '^washingtonpost.com$': function() {
                if ((this.config.pos === 'leaderboard' || this.config.pos === 'flex_bb_hp') && refresh) {
                    this.config.where += 'refresh';
                }
                if (this.config.pos === 'pushdown') {
                    var adi_push = doc.getElementById('wpni_adi_pushdown');
                    if (adi_push) {
                        adi_push.style.backgroundImage = 'url(http://img.wpdigital.net/wp-adv/test/mstest/pushdown-ad-small.png)';
                        adi_push.style.backgroundPosition = '-7px -100px';
                    }
                }
            },
			'/washingtonpost\.com|personalpost|obituaries|weather|jobs\/search/': function() {
				this.keyvalues['!c'].push('intrusive');
			}
        }
    };

    return overrides;

    });

})();
