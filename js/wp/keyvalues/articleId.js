(function(){

  'use strict';

  define(['utils/wp_meta_data'], function(wp_meta_data){

    return function(){
      var id = [], a;
      if(wp_meta_data.contentType && wp_meta_data.contentType[0] === "CompoundStory") {
        a = location.href.split("/");
        id = [a[a.length - 1].toLowerCase().split("_story")[0]];
      }
      return id;
    };

  });

})();