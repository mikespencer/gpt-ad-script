define(['utils'], function(utils){


  //leveraging wpAd.gptConfig.keyvalues in this file:
  var wpAd = window.wpAd || {};

  var _this = {

    config: {
      'local/education': [
        'http://pixel.mathtag.com/event/js?mt_id=202445&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'cars': [
        'http://pixel.mathtag.com/event/js?mt_id=202451&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'rentals': [
        'http://pixel.mathtag.com/event/js?mt_id=202454&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'local': [
        'http://pixel.mathtag.com/event/js?mt_id=202453&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'politics': [
        'http://pixel.mathtag.com/event/js?mt_id=202438&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'opinion': [
        'http://pixel.mathtag.com/event/js?mt_id=202441&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'nation': [
        'http://pixel.mathtag.com/event/js?mt_id=202439&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'travel': [
        'http://pixel.mathtag.com/event/js?mt_id=202446&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'realestate': [
        'http://pixel.mathtag.com/event/js?mt_id=202450&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'technology': [
        'http://pixel.mathtag.com/event/js?mt_id=202443&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'lifestyle': [
        'http://pixel.mathtag.com/event/js?mt_id=202447&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'world': [
        'http://pixel.mathtag.com/event/js?mt_id=202440&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'sports': [
        'http://pixel.mathtag.com/event/js?mt_id=202452&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'entertainment': [
        'http://pixel.mathtag.com/event/js?mt_id=202449&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'business': [
        'http://pixel.mathtag.com/event/js?mt_id=202442&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'washingtonpost.com': [
        'http://pixel.mathtag.com/event/js?mt_id=202444&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      //22493
      'politics/blog/federal-eye': [
        'http://pixel.mathtag.com/event/js?mt_id=365876&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'lifestyle/home': [
        'http://pixel.mathtag.com/event/js?mt_id=220658&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'national/on-innovations': [
        'http://pixel.mathtag.com/event/js?mt_id=220969&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'national/on-leadership': [
        'http://pixel.mathtag.com/event/js?mt_id=220970&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'jobs': [
        'http://pixel.mathtag.com/event/js?mt_id=221336&mt_adid=111184&v1=&v2=&v3=&s1=&s2=&s3=',
        'http://pixel.mathtag.com/event/js?mt_id=189665&mt_adid=109479&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'jobs/search/local': [
        'http://pixel.mathtag.com/event/js?mt_id=222228&mt_adid=111184&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      'entertainment/arkadium': [
        'http://pixel.mathtag.com/event/js?mt_id=294781&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ]
    },

    deConfig: {
      //.gov
      '100': ['http://pixel.mathtag.com/event/js?mt_id=223639&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='],
      //.mil and dod
      '101': [
        'http://pixel.mathtag.com/event/js?mt_id=223640&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3=',
        //21772
        'http://pixel.mathtag.com/event/js?mt_id=290243&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='
      ],
      //.edu
      '131': ['http://pixel.mathtag.com/event/js?mt_id=235239&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='],
      //21875 - .senate
      '126': ['http://pixel.mathtag.com/event/js?mt_id=305995&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='],
      //22824 - .state.gov
      '128': ['http://pixel.mathtag.com/event/js?mt_id=404572&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3'],
      //21875 - .house
      '121': ['http://pixel.mathtag.com/event/js?mt_id=305994&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3='],
      //OSD - de=1043
      '1043': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //NIH - de=1030
      '1030': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //DHS - de=106
      '106': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //NASA - de=1044
      '1044': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //NOAA - de=1045
      '1045': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //GSA - de=119
      '119': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //Ft. Belvior - de=1046
      '1046': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3='],
      //Pentagon - de=1048
      '1048': ['http://pixel.mathtag.com/event/js?mt_id=326174&mt_adid=114550&v1=&v2=&v3=&s1=&s2=&s3=']
    },

    debug: function(){
      if(utils.flags.debug && window.console){
        window.console.log.apply(window.console, Array.prototype.slice.call(arguments));
      }
    },

    addScriptPixel: function(pixel){
      utils.ajax({
        url: pixel,
        dataType: 'script',
        cache: true,
        crossDomain: true,
        timeout: 1000,
        error: function(err){
          _this.debug(pixel, 'error:', err);
        },
        success: function(data){
          _this.debug(pixel, 'loaded');
        }
      });
    },

    //21368-CW
    //21369-CW
    deVals: function(){
      var de = wpAd.gptConfig && wpAd.gptConfig.keyvalues && wpAd.gptConfig.keyvalues.de || [],
        l = de.length,
        pixl;

      while(l--){
        pixl = _this.deConfig[de[l]] ? _this.deConfig[de[l]].length : 0;
        while(pixl--){
          _this.addScriptPixel(deConfig[de[l]][pixl]);
        }
      }
    },

    exec: function(){
      var videoPage = utils.wp_meta_data.contentType && utils.wp_meta_data.contentType.toString() === 'VideoStory',
        where, check, l, config;

      //20951 - CW - WP+ pixel for wp sitewide
      _this.addScriptPixel('http://pixel.mathtag.com/event/js?mt_id=193782&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3=');

      for(where in config){
        if(_this.config.hasOwnProperty(where)){
          check = new RegExp('^' + where);
          if(check.test(window.commercialNode)){
            l = _this.config[where].length;
            while(l--){
              _this.addScriptPixel(_this.config[where][l]);
            }
          }
        }
      }

      _this.deVals();

      if(!videoPage){
        //21549-wp sitewide, non-video
        utils.addPixel('http://search.spotxchange.com/track/tag/7067.4067/img');
        //21498-ezra klein pages, non-video
        var authors = wpAd.gptConfig && wpAd.gptConfig.keyvalues && wpAd.gptConfig.keyvalues.author || [];
        var authorsLen = authors.length;

        while(authorsLen--){
          if(authors[authorsLen] === 'ezra_klein'){
            _this.addScriptPixel('http://pixel.mathtag.com/event/js?mt_id=235978&mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3=');
            break;
          }
        }
      }
    }

  };

  return _this;

});
