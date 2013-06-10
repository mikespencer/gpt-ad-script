define(function(){

  return function() {
    var vals, temp, l, str = window.crtg_content, rv = {};
    if(str){
      vals = str.split(';');
      l = vals.length;
      while(l--){
        temp = vals[l].split('=');
        if(temp[0] && temp[1]){
          rv[temp[0]] = [temp[1]];
        }
      }
    }
    return rv;
  };

});