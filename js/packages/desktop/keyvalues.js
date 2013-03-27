(function(define){

  'use strict';

  define([
    'keyvalues/exclusions',
    'keyvalues/front',
    'keyvalues/kw',
    'keyvalues/pageId',
    'keyvalues/poe',
    'keyvalues/ref',
    'keyvalues/rs',
    'keyvalues/u'
  ], function(exclusions, front, kw, pageId, poe, ref, rs, u){

    /**
     * Each key can take either a function, or an Array of functions that can assign multiple values
     * to that particular key. 
     */
    return {
      '!c': [exclusions],
      front: [front],
      kw: [kw],
      pageId: [pageId],
      poe: [poe],
      ref: [ref],
      rs: [rs],
      u: [u]
    };

  });

})(window.define);