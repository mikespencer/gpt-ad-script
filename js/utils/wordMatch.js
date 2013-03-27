(function(define){

  'use strict';

  define(['utils/isArray'], function(isArray){

    /**
     * Checks each word in an array to see if that word (including variations) exists in a string.
     * @param {Array|String} wordList A list of words to check for.
     * @param {String} str String of words to check against.
     * @param {Boolean} opt_noVariations Set to true to just check exact words, without variations.
     * @return {Boolean} Returns true if a match is found, else returns false.
     */
    return function (wordList, str, opt_noVariations) {
      opt_noVariations = opt_noVariations || false;
      wordList = isArray(wordList) ? wordList : [wordList];
      var regex = [],
        variations = opt_noVariations ? '' : '(|s|es|ed|ing|er)',
        l = wordList.length;
      if(l && str){
        while(l--) {
          regex.push(wordList[l] + variations);
        }

        regex = '\\b' + regex.join('\\b|\\b') + '\\b';
        return (new RegExp(regex, 'i').test(str));
      }
      return false;
    };

  });

})(window.define);