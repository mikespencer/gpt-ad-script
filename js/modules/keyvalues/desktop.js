define([
  'keyvalues/config/crtg_content',
  'keyvalues/config/exclusions',
  'keyvalues/config/front',
  'keyvalues/config/kw',
  'keyvalues/config/pageId',
  'keyvalues/config/poe',
  'keyvalues/config/ref',
  'keyvalues/config/rs',
  'keyvalues/config/u'
], function(crtg_content, exclusions, front, kw, pageId, poe, ref, rs, u){

  /**
   * Each key can take either a function, or an Array of functions that can assign multiple values
   * to that particular key.
   */
  return {
    crtg_content: [crtg_content],
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