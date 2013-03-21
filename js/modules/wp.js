/**
 * washingtonpost.com site specific ad script (desktop)
 */
(function(w, d, commercialNode, define) {

    'use strict';

    if (typeof define === 'function') {
        define('wp', ['generic', 'json!wp.config.json', 'utils', 'wp.overrides', 'zoneBuilder'], function(wpAd, config, utils, overrides, zoneBuilder) {

            //override commercialNode on wp
            w.commercialNode = zoneBuilder.exec();

            //add wp specific flags
            utils.extend(wpAd.flags, {
                reload: (utils.urlCheck('reload', {
                    type: 'variable'
                }) === 'true')
            });

            /**
             * Add ad specific, site specific keyvalues here:
             */
            utils.extend(wpAd.Ad.prototype.keyvaluesConfig, {
                article: function() {
                    return ['wp_article'];
                }
            });

            /**
             * Add global, site specific keyvalues here:
             */
            utils.extend(wpAd.GPTConfig.prototype.keyvaluesConfig, {
                WPATC: function() {
                    return ['wpatc_cookie'];
                },
                front: function() {
                    return ['true'];
                }
            });

            //commercialNode base:
            wpAd.dfpSite = '/701/wpni.';

            //pass in config:
            wpAd.config = config;

            //pass in site specific overrides:
            wpAd.overrides = overrides;

            //expose helper functions:
            wpAd.utils = utils;

            //testing
            wpAd.init.push(function() {
                try {
                    w.console.log('loaded and initialising');
                } catch (e) {}
            });

            return wpAd;
        });
    }

})(window, document, window.commercialNode, window.define);
