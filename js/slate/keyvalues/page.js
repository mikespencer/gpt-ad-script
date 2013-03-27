(function(define) {

    'use strict';

    define([
		'utils/wp_meta_data', 
		'utils/zoneBuilder'
		], function(wp_meta_data, zoneBuilder) {

        return function() {
            if (typeof wp_meta_data !== 'undefined' && wp_meta_data.contentType && zoneBuilder.contentType[wp_meta_data.contentType[0]]) {
                page = [zoneBuilder.contentType[wp_meta_data.contentType[0]]];
                return page;
            }
            //default to article and check for homepage
            page = commercialNode !== 'homepage' ? ['article'] : ['front'];
            return page;
        };

    });

})(window.define);
