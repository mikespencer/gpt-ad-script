/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
define([
  'utils/merge',
  'keyvalues/desktop',
  'utils/wp_meta_data',
  'utils/wordMatch',
  'utils/keywords',
  'utils/getCookie'
], function(merge, kvs, wp_meta_data, wordMatch, keywords, getCookie){

  return merge(kvs, {

    '!c': [
      function(){
        return (/washingtonpost\.com|personalpost|obituaries|weather|jobs\/search/).test(commercialNode) ?
          ['intrusive'] : false;
      }
    ],

    articleId: [
      function(){
        var id = [], a;
        if(wp_meta_data.contentType && wp_meta_data.contentType[0] === "CompoundStory") {
          a = location.href.split("/");
          id = [a[a.length - 1].toLowerCase().split("_story")[0]];
        }
        return id;
      }
    ],

    kw: [
      function(){
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
      }
    ],

    WPATC: [
      function(){
        var cookie = getCookie('WPATC'),
          rv = {},
          l, a, key;

        if(cookie) {
          cookie = unescape(cookie).split(':');
          l = cookie.length;
          while(l--) {
            a = cookie[l].split('=');
            if(rv[a[0]]) {
              rv[a[0]].push(a[1]);
            } else {
              rv[a[0]] = [a[1]];
            }
          }
        }

        return rv;
      }
    ]

  });

});