define(['utils'], function(utils){

  return function(){
    var l = utils.wp_meta_data.page_id ? utils.wp_meta_data.page_id.length : [];
    while(l--){
      utils.wp_meta_data.page_id[l] = utils.wp_meta_data.page_id[l].toString().replace(/\./g, '_');
    }
    return utils.wp_meta_data.page_id;
  };

});