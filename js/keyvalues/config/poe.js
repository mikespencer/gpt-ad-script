define(['utils'], function(utils){

  return function(){
    var name = window.location.hostname + '_poe';
    if(utils.getCookie(name)){
      return ['no'];
    } else {
      utils.setCookie(name, 'true', '', '/', '','');
      return ['yes'];
    }
  };

});