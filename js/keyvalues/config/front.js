define(['utils'], function(utils){

  return function(){
    return utils.flags.front ? ['y'] : ['n'];
  };

});