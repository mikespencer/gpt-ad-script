(function(d, define){

  'use strict';

  define(['utils/wp_meta_data'], function(wp_meta_data){

    return (function(){
      if(wp_meta_data.contentType) {
        return wp_meta_data.contentType[0] === 'front' || wp_meta_data.contentType === 'front';
      }
      if(/^homepage/.test(commercialNode)){
        return true;
      }
      //non-methode pages:
      return w.commercialPageType && w.commercialPageType === 'front' ? true : false;
    })();

  });

})(document, window.define);