define(['utils'], function(utils){

  return function(){
    return utils.flags.test_ads ? ['test_' + utils.flags.test_ads] : false;
  };

});