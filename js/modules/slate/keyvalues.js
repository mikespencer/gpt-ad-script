/**
* Extends universal desktop, page level keyvalues with slate desktop specific keyvalues
*/
define([
  'modules/utils',
  'modules/keyvalues/desktop'
], function(utils, kvs){

  return utils.merge(kvs, {

    articleId: [
      function() {
        var href = location.href.split(/\?/)[0].split('/'),
          title = href[href.length - 1].split(/\..*?\.htm/),
          len, i, articleId = '';

        if (title[0]) {
          title = title[0];
          len = title.length;
          if (len > 30) {
            title = title.split('_');
            for (i = 0; i < len; i++) {
              if (title[i]) {
                articleId = articleId + title[i].slice(0, 1);
              }
            }
          } else {
            articleId = title;
          }
        }
        return articleId;
      }
    ],

    crtg_content: [
      function() {
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
      }
    ],

    amazon: [
      function() {
        return document.amzn_args || window.amzn_args || false;
      }
    ],

    page: [
      function() {
        return commercialNode !== 'homepage' ? ['article'] : ['front'];
      }
    ],

    dept: [
      function(){
        return window.PStax ? [window.PStax] : [];
      }
    ]

  });

});