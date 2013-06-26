define(['utils','zoneBuilder'], function(utils, zoneBuilder){

  return function(){
    var s_vi = utils.getCookie('s_vi'),
      rv = false;

    //pass in s_vi cookie value:
    if(s_vi) {
      s_vi = s_vi.split(/\|/)[1];
      if(s_vi) {
        s_vi = s_vi.split(/\[/)[0].split(/-/);
        rv = 'o*' + s_vi[0] + ',' + s_vi[1];

        //get page name, replace spaces with underscores and then limit the string to 100 characters
        if(window.TWP && TWP.Data && TWP.Data.Tracking && TWP.Data.Tracking.props && TWP.Data.Tracking.props.page_name){
          rv += ',' + TWP.Data.Tracking.props.page_name.replace(/ /g, '_').slice(0, 100);
        }

        //",,,", then get page type and then need to append ",abc" to the end
        rv += ',,,' + (zoneBuilder.contentType[utils._toString(utils.wp_meta_data.contentType).toLowerCase()] || 'article') + ',abc';
      }
    }

    return [rv];
  };

});