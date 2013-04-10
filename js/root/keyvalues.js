/**
* Extends universal desktop, page level keyvalues with root desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/merge',
    'packages/desktop/keyvalues',
    'root/keyvalues/articleId'
  ], function(merge, kvs, articleId){

    return merge(kvs, {
      articleId: [articleId]
    });

  });

})(window.define);