define([
  'modules/keyvalues/config/exclusions',
  'modules/keyvalues/config/front',
  'modules/keyvalues/config/kw',
  'modules/keyvalues/config/pageId',
  'modules/keyvalues/config/poe',
  'modules/keyvalues/config/ref',
  'modules/keyvalues/config/rs',
  'modules/keyvalues/config/u'
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