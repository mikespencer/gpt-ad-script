define([
  'keyvalues/config/kw',
  'keyvalues/config/poe',
  'keyvalues/config/khost',
  'keyvalues/config/kuid',
  'keyvalues/config/ksg'
], function(kw, poe, khost, kuid, ksg){

  /**
   * Each key can take either a function, or an Array of functions that can assign multiple values
   * to that particular key.
   */
  return {
    kw: [kw],
    poe: [poe],
    khost: [khost],
    kuid: [kuid],
    ksg: [ksg]
  };

});