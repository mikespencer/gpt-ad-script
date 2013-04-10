define(['utils/isArray', 'utils/wp_meta_data'], function(isArray, wp_meta_data){

  /**
   * A string of page keywords.
   * @type {String}
   */
  return (function () {
    if(wp_meta_data.keywords) {
      return isArray(wp_meta_data.keywords) ? wp_meta_data.keywords.join(",") :
        wp_meta_data.keywords;
    } else {
      //Pages where wp_meta_data.keywords is undefined.. there are plenty:
      var meta = document.getElementsByTagName('meta'),
        l = meta.length,
        content;

      while(l--) {
        if(meta[l].getAttribute('name') === 'keywords') {
          content = meta[l].getAttribute('content');
          if(content){
            return content;
          }
        }
      }
    }
    return '';
  })();

});