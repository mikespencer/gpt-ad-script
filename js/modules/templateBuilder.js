/**
 * Checks and builds an ad template of open spots on the current page
 */
define(['utils'], function(utils){

  return {

    demoAds: utils.urlCheck('demoAds', {type: 'variable'}),

    exec: function(json){
      this.template = {};
      for(var key in json){
        if(json.hasOwnProperty(key)){
          json[key].id = key;
          if(this.checkFlight(json[key])){
            this.addToTemplate(json[key]);
          }
        }
      }
      if(this.demoAds){
        this.template = this.demoAdsTemplate(this.demoAds, this.template);
      }
      return this.template;
    },

    checkFlight: function(template){
      var key;
      for(key in this.checks){
        if(this.checks.hasOwnProperty(key) && template.hasOwnProperty(key)){
          if(!this.checkProperty(key, template[key])){
            return false;
          }
        }
      }
      return true;
    },

    checkProperty: function(prop, val){
      val = utils.isArray(val) ? val : [val];

      var l = val.length,
        i = 0,
        check = false;

      for(i;i<l;i++){
        if(this.checks[prop](val[i])){
          check = true;
        }
      }
      return check;
    },

    addToTemplate: function(template){
      if(template.what){
        var pos = template.what, l = pos.length, i = 0, newPos;
        for(i;i<l;i++){
          if(pos[i].charAt(0) === '!'){
            newPos = pos[i].substr(1);
            if(this.template[newPos]){
              delete this.template[newPos];
            }
          } else {
            this.template[pos[i]] = template;
          }
        }
      }
    },

    demoAdsTemplate: function(adStr, template){
      var ads = adStr.split(';'),
        l = ads.length,
        rv = {};
      while(l--){
        ads[l] = this.posConverter(ads[l]);
        rv[ads[l]] = template[ads[l]] || { id: 'demoAds'};
      }
      return rv;
    },

    posConverter: function(pos){
      var convert = {
        'ad1': 'leaderboard',
        'ad2': 'leaderboard_2',
        'ad3': 'skyscraper',
        'ad6': 'flex_ss_bb_hp',
        'ad7': 'featurebar',
        'ad14': 'tiffany_tile',
        'ad16': 'flex_bb_hp',
        'ad19': '336x35',
        'ad20': 'bigbox',
        'ad43': 'pushdown',
        'ad44': 'extra_bb',
        'ad45': 'deal',
        'brandconnect': 'brandconnect_module'
      };
      return convert.hasOwnProperty(pos) ? convert[pos] : pos;
    },

    //true/false checks:
    checks: {

      test: function(val){
        return typeof val === 'function' ? val() : val;
      },

      where: function(where){
        var open = true;
        if(where.charAt(0) === '!'){
          open = false;
          where = where.substr(1);
        }
        return new RegExp('^' + where).test(commercialNode) ? open : false;
      },

      when: function (when) {
        var today = utils.flags.test_date ? utils.flags.test_date + '0000' : utils.estNowWithYear;
        if(/\//.test(when)){
          when = when.split('/');
          return when[0] <= today.substr(0, when[0].length) &&
            when[1] >= today.substr(0, when[1].length);
        } else {
          var now = today.substr(0, when.length);
          return when === now;
        }
      }
    }

  };

});
