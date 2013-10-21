define(['utils', 'zoneBuilder'], function(utils, zoneBuilder){

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

});
