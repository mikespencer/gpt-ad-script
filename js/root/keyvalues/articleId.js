/**
 * Returns a string approximating the article name
 * 
 */

(function(loc, define) {

    'use strict';

    define(function() {

        return function() {
            var segments = loc.pathname.split('/'),
                pageEnd = segments[segments.length - 1],
				articleId;
            articleId = pageEnd.split('.')[0] || '';
            return articleId;
        };
    });
})(location, window.define);
