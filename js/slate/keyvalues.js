/**
* Extends universal desktop, page level keyvalues with slate desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/extendKeyvalues',
    'utils/contentTypes',
    'utils/wp_meta_data',
    'packages/desktop/keyvalues'
  ], function(extendKeyvalues, contentTypes, wp_meta_data, kvs){

    return extendKeyvalues(kvs, {

      articleId: [
        function() {
          var href = location.href.split('/'),
            title = href[href.length - 1].split(/\..*?\.htm/),
            len, i, articleId = '';

          if (title[0]) {
            title = title[0];
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
        }
      ],

      amazon: [
        function() {
          return document.amzn_args || window.amzn_args || false;
        }
      ],

      page: [
        function() {
          if (wp_meta_data.contentType && contentTypes[wp_meta_data.contentType[0]]) {
            return [contentTypes[wp_meta_data.contentType[0]]];
          }
          return commercialNode !== 'homepage' ? ['article'] : ['front'];
        }
      ],

      dept: [
        function(){
          return window.PStax ? [window.PStax] : [];
        }
      ]

    });

  });

})(window.define);