define(['utils'], function(utils){

  return function(){
    if(!utils.wp_meta_data.page_id){
      return false;
    }
    var l = utils.wp_meta_data.page_id.length;
    while(l--){
      utils.wp_meta_data.page_id[l] = utils.wp_meta_data.page_id[l].replace(/\./g, '_');
    }
    return utils.wp_meta_data.page_id;
  };

});