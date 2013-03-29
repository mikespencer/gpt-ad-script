/**
* Extends universal desktop, page level keyvalues with root desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/extendKeyvalues',
    'packages/desktop/keyvalues',
    'root/keyvalues/articleId'
  ], function(extendKeyvalues, kvs, articleId){

    return extendKeyvalues(kvs, {
      articleId: [articleId]
    });

  });

})(window.define);