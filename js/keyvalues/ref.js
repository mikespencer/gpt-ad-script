(function(d, define){

  'use strict';

  define(function(){

    return function(){
      var ref = [],
        r = d.referrer || '';
      if(/facebook\.com|digg\.com|reddit\.com|myspace\.com|newstrust\.net|twitter\.com|delicious\.com|stumbleupon\.com/i.test(r)) {
        ref.push('social');
      }
      if(location.search.match('wpisrc=')) {
        ref.push('email');
      }
      return ref;
    };

  });

})(document, window.define);