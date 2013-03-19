/**
 * Extended universal desktop/sitewide page level keyvalues. These are everywhere on desktop
 */
(function(w, d, define){

  'use strict';

  define(['utils', 'keyvalues.core', 'wp_meta_data'], function(utils, kvs, wp_meta_data){

    return utils.extend(kvs, {

      '!c': function(){
        var rv = [],
          obj = {
            natural_disaster : ['shell', 'exxon', 'citgo', 'bp', 'chevron', 'hess', 'sunoco',
              'disaster', 'fire', 'explosion', 'oil', 'coal', 'death', 'dead', 'quake', 'earthquake',
              'tsunami', 'tornado', 'hurricane', 'flood','bed bug','infestation'],
            human_disaster : ['shoot', 'vatican', 'spanair', 'aground', 'rescue', 'attack', 'disaster',
              'explosion', 'war', 'hostage', 'terror', 'terrorist', 'bomb', 'blast', 'mining', 'miner',
              'violence', 'riot', 'crash', '9/11', 'sept. 11', 'september 11'],
            financial_crisis : ['corrupt', 'goldman', 'aig', 'foreclosure', 'enron', 'sec', 'mortgage',
              'Insurance', 'health', 'bank', 'wall street', 'protest', 'labor strike', 'union strike',
              'labor issue', 'union issue', 'teacher strike', 'teachers strike', 'election'],
            inappropriate : ['gambling','sex','alcohol','pornography']
          },
          key;

        if(!utils.front) {
          for(key in obj) {
            if(obj.hasOwnProperty(key) && utils.metaCheck(obj[key], utils.keywords)) {
              rv.push(key);
            }
          }
        }

        return rv;
      },

      front: function(){
        return utils.front ? ['y'] : ['n'];
      },

      pageId: function(){
        if(!wp_meta_data.page_id){
          return false;
        }
        var l = wp_meta_data.page_id.length;
        while(l--){
          wp_meta_data.page_id[l] = wp_meta_data.page_id[l].replace(/\./g, '_');
        }
        return wp_meta_data.page_id;
      },

      ref: function(){
        var ref = [],
          r = d.referrer || '';
        if(/facebook\.com|digg\.com|reddit\.com|myspace\.com|newstrust\.net|twitter\.com|delicious\.com|stumbleupon\.com/i.test(r)) {
          ref.push('social');
        }
        if(location.search.match('wpisrc=')) {
          ref.push('email');
        }
        return ref;
      },

      rs: function(){
        var cookie = utils.getCookie('rsi_segs'),
          rv = [],
          i, l;
        if(cookie){
          cookie = cookie.replace(/J05531_/gi, 'j').replace(/D08734_/gi, 'd').split('|');
          l = cookie.length;
          for(i=0;i<l;i++){
            rv.push(cookie[i]);
          }
        }
        return rv;
      },

      u: function(){
        var s_vi = utils.getCookie('s_vi'),
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
            rv += ',,,' + (wp_meta_data.contentType && wpAd.tools.zoneBuilder.contentType[wp_meta_data.contentType.toString()] ?
              wpAd.tools.zoneBuilder.contentType[wp_meta_data.contentType.toString()] : 'article') + ',abc';
          }
        }

        return [rv];
      }

    });

  });

})(window, document, window.define);