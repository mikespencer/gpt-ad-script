define(['utils/wp_meta_data'], function(wp_meta_data){

  return function(){
    if(!wp_meta_data.page_id){
      return false;
    }
    var l = wp_meta_data.page_id.length;
    while(l--){
      wp_meta_data.page_id[l] = wp_meta_data.page_id[l].replace(/\./g, '_');
    }
    return wp_meta_data.page_id;
  };

});