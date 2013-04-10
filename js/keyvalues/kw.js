define(['utils/urlCheck'], function(urlCheck){

  return function(){
    var param = urlCheck('test_ads', { type: 'variable' });
    return param ? ['test_' + param] : false;
  };

});