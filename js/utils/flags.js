define([
  'utils/wp_meta_data'
], function(wp_meta_data){

  return {
    allAds: (/allads/i.test(location.search)),

    debug: (/debugadcode/i.test(location.search)),

    front: (function(){
      if(wp_meta_data.contentType) {
        return wp_meta_data.contentType[0] === 'front' || wp_meta_data.contentType === 'front';
      }
      if(/^homepage/.test(commercialNode)){
        return true;
      }
      //non-methode pages:
      return window.commercialPageType && window.commercialPageType === 'front' ? true : false;
    })(),

    no_interstitials: (/no_interstitials/i.test(location.search))

  };

});