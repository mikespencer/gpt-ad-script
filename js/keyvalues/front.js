define(['utils/flags'], function(flags){

  return function(){
    return flags.front ? ['y'] : ['n'];
  };

});