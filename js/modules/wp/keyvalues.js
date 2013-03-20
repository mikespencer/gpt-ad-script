/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
(function(w, d, define){

  'use strict';

  define([
    'utils/extend',
    'keyvalues/all',
    'wp/keyvalues/articleId',
    'wp/keyvalues/WPATC'
  ], function(extend, kvs, articleId, WPATC){

    return extend(kvs, {
      articleId: articleId,
      WPATC: WPATC
    });

  });

})(window, document, window.define);