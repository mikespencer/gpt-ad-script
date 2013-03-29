(function(define) {

    'use strict';

    define(function() {

        return function() {
            var href = location.href.split('/'),
                title = href[href.length - 1].split(/\..*?\.html|\.html/)[0],
                len, i, articleId = '';

            if (title) {
                len = title.length;
                if (len > 30) {
                    title = title.split('_');
                    for (i = 0; i < len; i++) {
                        if (title[i]) {
                            articleId = articleId + title[i].slice(0, 1);
                        }
                    }
                } else {
                    articleId = title;
                }
            }
            return articleId;
        };

    });

})(window.define);
