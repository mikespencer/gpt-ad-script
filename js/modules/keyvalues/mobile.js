define([
  'modules/keyvalues/config/kw',
  'modules/keyvalues/config/poe'
], function(kw, poe){

  /**
   * Each key can take either a function, or an Array of functions that can assign multiple values
   * to that particular key.
   */
  return {
    kw: [kw],
    poe: [poe]
  };

});