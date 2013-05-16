/**
* Extends universal desktop, page level keyvalues with root desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/merge',
    'keyvalues/desktop',
    'root/keyvalues/articleId'
  ], function(merge, kvs, articleId){

    return merge(kvs, {
      articleId: [articleId]
    });

  });

})(window.define);