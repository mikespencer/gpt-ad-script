/**
 * Extends Universal, page level keyvalues with wp mobile specific keyvalues
 */
define([
  'utils',
  'keyvalues/mobile'
], function(utils, kvs){

  return utils.merge(kvs, {
    //Slate mobile web specific page level keyvalues here
  });

});