/**
 * Extends universal desktop, page level keyvalues with wp desktop specific keyvalues
 */
define(['keyvalues/desktop', 'utils', 'zoneBuilder'], function(kvs, utils, zoneBuilder){

  return utils.merge(kvs, {

    '!c': [
      function(){
        return (/washingtonpost\.com|personalpost|obituaries|weather|jobs\/search/).test(commercialNode) ?
          ['intrusive'] : false;
      }
    ],

    author: [
      function(){
        var author = utils.wp_meta_data.author,
          rv = [],
          l, i;
        if(author){
          l = author.length;
          for(i=0;i<l;i++){
            if(author[i]){
              rv.push(author[i].replace(/[^\w\s]/gi, '').replace(/\s/g,"_").toLowerCase());
            }
          }
        }
        return rv;
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

    de: [
      function(){
        var cookie = utils.getCookie('de');
        if(cookie){
          cookie = unescape(cookie);
          cookie = cookie.split(':');
          return cookie.length ? cookie : false;
        }
        return false;
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

    page: [
      function(){
        return utils.wp_meta_data.contentType && zoneBuilder.contentType[utils.wp_meta_data.contentType.toString().toLowerCase()] || ['article'];
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
    ],

    areaId: [
      function(){
        var a = utils.urlCheck('areaId', {
          type: 'variable'
        }), rv = [];
        if(window.hs && window.hs.geo_area_id) {
          rv = win.hs.geo_area_id.split(';');
        }
        if(a) {
          rv.push(a);
        }
        return rv;
      }
    ],

    aptco: [
      function(){
        var a = utils.urlCheck('aptco', {
          type: 'variable'
        });
        return a ? [a] : [];
      }
    ],

    metro: [
      function(){
        var a = utils.urlCheck('metro', {
          type: 'variable'
        });
        return a ? [a] : [];
      }
    ],


    //wtf is this...? need to check on this to see if we can remove it
    locExpSponsor: [
      function(){
        var rv = [];
        if(window.countyName && window.stateName) {
          var invalidKW = ['?', '=', '/', '\\', ':', ';', ',', '*', '(', ')', '&', '$', '%', '@',
            '!', '^', '+', ' ', '[', ']', '{', '}', '.'],
            l = invalidKW.length,
            csRE;

          while(l--) {
            csRE = new RegExp('(\\' + invalidKW[l] + ')', 'g');
            countyName = countyName.replace(csRE, "").toLowerCase();
            stateName = stateName.replace(csRE, "").toLowerCase();
          }

          rv = [window.countyName + "-" + window.stateName];
        }
        return rv;
      }
    ],

    ppwidget: [
      function(){
        return utils.urlCheck('tid', {type:'variable'}) === 'pp_stream' ? '1' : '';
      }
    ],

    wpnode: [
      function(){
        return window.commercialNode;
      }
    ]

  });

});