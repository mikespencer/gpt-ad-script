/**
 * Extends Universal, page level keyvalues with theroot mobile specific keyvalues
 */
define([
  'utils',
  'keyvalues/mobile'
], function(utils, kvs){

  return utils.merge(kvs, {
    //Theroot mobile web specific page level keyvalues here
  });

});
