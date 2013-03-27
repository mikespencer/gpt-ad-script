(function(define){

  'use strict';

  define([
    'utils/wordMatch',
    'utils/keywords'
  ], function(wordMatch, keywords){

    return function(){
      var rv = [],
        categories = {
          energy: ['energy'],
          re: ['builder', 'condo', 'home', 'homeowner', 'housing', 'mortgage', 'property',
              'real estate', 'realtor', 'refinance', 'neighborhood']
        },
        key;

      for(key in categories) {
        if(categories.hasOwnProperty(key) && wordMatch(categories[key], keywords)) {
          rv.push(key);
        }
      }
      return rv;
    };

  });

})(window.define);