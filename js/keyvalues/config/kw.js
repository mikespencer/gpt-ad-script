define(['utils'], function(utils){

  return function(){
    var param = utils.urlCheck('test_ads', { type: 'variable' });
    return param ? ['test_' + param] : false;
  };

});