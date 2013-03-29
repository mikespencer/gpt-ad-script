/**
* Extends universal desktop, page level keyvalues with slate desktop specific keyvalues
*/
(function(define){

  'use strict';

  define([
    'utils/extendKeyvalues',
    'packages/desktop/keyvalues',
    'slate/keyvalues/articleId',
    'slate/keyvalues/amazon',
    'slate/keyvalues/page',
	'slate/keyvalues/dept'
  ], function(extendKeyvalues, kvs, articleId, amazon, page, dept){

    return extendKeyvalues(kvs, {
      articleId: [articleId],
      amazon: [amazon],
      page: [page],
	  dept: [dept]
    });

  });

})(window.define);