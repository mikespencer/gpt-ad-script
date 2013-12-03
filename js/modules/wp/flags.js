/**
 * WP specific flags. Ultimately used to extend utils.flags
 */
define(['utils', 'zoneBuilder'], function(utils, zoneBuilder){

  return {

    pageType: (function(){
      var contentTypes = utils.clone(zoneBuilder.contentType);
      var rv = {};

      //unique check for homepage:
      if(/^washingtonpost\.com/.test(window.commercialNode)){
        return {
          homepage: true
        };
      }

      if(utils.wp_meta_data.contentType && contentTypes){
        //additional possible conetent types to check for (extended from zonebuilder):
        contentTypes.compoundstory = 'article';

        var ct = utils._toString(utils.wp_meta_data.contentType).toLowerCase();
        if(contentTypes[ct]){
          rv[contentTypes[ct]] = true;
        }
      }

      return rv;
    })(),

    beta: (function(){
      var meta = document.getElementsByTagName('meta'), l = meta.length, i;
      for(i = 0; i < l; i++){
        if(meta[i].name === 'site-identity'){
          return meta[i].content === 'prodportal-B';
        }
      }
      return false;
    })()

  };

});
