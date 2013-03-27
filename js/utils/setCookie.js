(function(){

  'use strict';

  define(function(){

    /**
     * Sets a document cookie
     * @param {String} name Name of the cookie
     * @param {String} val Value of the cookie
     * @param {String} opt_expires Expires
     * @param {String} opt_path Path
     * @param {String} opt_domain Domain
     * @param {Boolean} opt_secure Secure
     */
    return function (name, val, opt_expires, opt_path, opt_domain, opt_secure) {
      document.cookie = name + "=" + escape(val) + (opt_expires ? "; expires=" + opt_expires : "") +
        (opt_path ? "; path=" + opt_path : "") + (opt_domain ? "; domain=" + opt_domain : "") +
        (opt_secure ? "; secure" : "");
    };

  });

})();