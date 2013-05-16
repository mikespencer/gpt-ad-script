define([
  'utils/setCookie',
  'utils/getCookie'
], function(setCookie, getCookie){

  return function(){
    var name = window.location.hostname + '_poe';
    if(getCookie(name)){
      return ['no'];
    } else {
      setCookie(name, 'true', '', '/', '','');
      return ['yes'];
    }
  };

});