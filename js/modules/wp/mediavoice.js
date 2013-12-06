define(['jQuery', 'utils'], function($, utils){

  return {

    loaded: false,

    secondaryPage: !!(/sf\/brand-connect/.test(window.location.pathname)),

    load: function(){
      if(!this.loaded){
        this.loaded = true;
        $(document).ready(function(){
          utils.ajax({
            url: 'http://js.washingtonpost.com/wp-srv/ad/min/mediavoice.js',
            success: function(){}
          });
        });
      }
    }

  };

});