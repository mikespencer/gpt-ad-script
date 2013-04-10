define(['utils/getCookie'], function(getCookie){

  return function(){
    var cookie = getCookie('rsi_segs'),
      rv = [],
      i, l;
    if(cookie){
      cookie = cookie.replace(/J05531_/gi, 'j').replace(/D08734_/gi, 'd').split('|');
      l = cookie.length;
      for(i=0;i<l;i++){
        rv.push(cookie[i]);
      }
    }
    return rv;
  };

});