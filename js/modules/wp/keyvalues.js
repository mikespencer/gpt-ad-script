/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
define(['keyvalues/desktop', 'utils'], function(kvs, utils){

  return utils.merge(kvs, {

    '!c': [
      function(){
        return (/washingtonpost\.com|personalpost|obituaries|weather|jobs\/search/).test(commercialNode) ?
          ['intrusive'] : false;
      }
    ],

    articleId: [
      function(){
        var id = [], a;
        if(utils.wp_meta_data.contentType && utils.wp_meta_data.contentType[0] === "CompoundStory") {
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
          if(categories.hasOwnProperty(key) && utils.wordMatch(categories[key], utils.keywords)) {
            rv.push(key);
          }
        }
        return rv;
      }
    ],

    WPATC: [
      function(){
        var cookie = utils.getCookie('WPATC'),
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