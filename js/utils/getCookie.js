define(function(){

  /**
   * Reads a document cookie value.
   * @param {String} name The name of the cookie to read.
   * @return {String|null} The cookie value, or null if the cookie does not exist.
   */
  return function(name){
    var cookie = '' + document.cookie,
      search = '' + name + '=',
      str = null,
      offset = 0,
      end = 0;
    if (cookie.length > 0) {
      offset = cookie.indexOf(search);
      if (offset !== -1) {
        offset += search.length;
        end = cookie.indexOf(';', offset);
        if (end === -1) {
          end = cookie.length;
        }
        str = unescape(cookie.substring(offset, end));
      }
    }
    return str;
  };

});
