define(['utils'], function(utils){

  return function(){
    var page_id = utils.wp_meta_data.page_id;
    return page_id ? [ page_id.toString().replace(/\./g, '_') ] : [];
  };

});