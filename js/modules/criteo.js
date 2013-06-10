define(['utils'], function(utils){
  return {
    enabled: (!/msie 6|msie 7|msie 8/i.test(navigator.userAgent)),
    exec: function(){
      if(this.enabled){

        var crtg_nid = "1180",
          crtg_cookiename = "cto_was",
          crtg_url;

        window.crtg_content = (function(c_name) {
          var i, x, y, ARRcookies = document.cookie.split(";"), l = ARRcookies.length;
          for (i = 0; i < l; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
              return unescape(y);
            }
          }
          return '';
        })(crtg_cookiename);

        crtg_url = 'http://rtax.criteo.com/delivery/rta/rta.js?netId=' + escape(crtg_nid);
        crtg_url += '&cookieName=' + escape(crtg_cookiename);
        crtg_url += '&rnd=' + Math.floor(Math.random() * 99999999999);
        crtg_url += '&varName=crtg_content';

        utils.ajax({
          url: crtg_url
        });

      }

      return this;
    }
  };
});