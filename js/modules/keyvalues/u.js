(function(w, define){

  'use strict';

  define([
    'utils/getCookie',
    'utils/wp_meta_data',
    'utils/zoneBuilder'
  ], function(getCookie, wp_meta_data, zoneBuilder){

    return function(){
      var s_vi = getCookie('s_vi'),
        rv = false;

      //pass in s_vi cookie value:
      if(s_vi) {
        s_vi = s_vi.split(/\|/)[1];
        if(s_vi) {
          s_vi = s_vi.split(/\[/)[0].split(/-/);
          rv = 'o*' + s_vi[0] + ',' + s_vi[1];

          //get page name, replace spaces with underscores and then limit the string to 100 characters
          if(w.TWP && TWP.Data && TWP.Data.Tracking && TWP.Data.Tracking.props && TWP.Data.Tracking.props.page_name){
            rv += ',' + TWP.Data.Tracking.props.page_name.replace(/ /g, '_').slice(0, 100);
          }

          //",,,", then get page type and then need to append ",abc" to the end
          rv += ',,,' + (wp_meta_data.contentType && zoneBuilder.contentType[wp_meta_data.contentType.toString()] ?
            zoneBuilder.contentType[wp_meta_data.contentType.toString()] : 'article') + ',abc';
        }
      }

      return [rv];
    };

  });

})(window, window.define);