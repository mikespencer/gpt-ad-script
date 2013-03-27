/**
* Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/extendKeyvalues',
    'packages/desktop/keyvalues',
    'wp/keyvalues/articleId',
    'wp/keyvalues/kw',
    'wp/keyvalues/WPATC'
  ], function(extendKeyvalues, kvs, articleId, kw, WPATC){

    return extendKeyvalues(kvs, {
      articleId: [articleId],
      kw: [kw],
      WPATC: [WPATC]
    });

  });

})(window.define);