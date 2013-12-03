define(['jQuery'], function($){
  return {
    exec: function(selector){
      selector = selector || 'iframe[id^="google_ads_iframe"]:visible';
      $(selector).each(function(i, el){
        var $this = $(this),
          hasContent = $this.contents().find('body *').length;
        if(!hasContent){
          $this.hide().closest('[id^="slug_"]').hide();
        }
      });
    }
  };
});
