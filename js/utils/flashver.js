(function(w, define){

  'use strict';

  define(function(){

    /**
     * Detects and returns the version of Flash Player installed.
     * @return {Number} Version of Flash Player, or 0 if no Flash Player.
     */
    return function(){
      var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
      if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
      else if(!!(w.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
      return 0;
    };

  });

})(window, window.define);