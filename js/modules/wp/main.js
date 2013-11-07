/**
 * washingtonpost.com site specific ad script (desktop)
 */
define([
  'jQuery',
  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'zoneBuilder',
  'templateBuilder',
  'wp/config',
  'wp/keyvalues',
  'wp/overrides',
  'wp/hpRefresh',
  'wp/textlinks',
  'wp/wpPlus',
  'wp/flags',
  'wp/subscriber',
  'criteo',
  'wp/dynamicRightRailAds'

], function(
  $,
  defaultSettings,
  Ad,
  gptConfig,
  utils,
  zoneBuilder,
  templateBuilder,
  config,
  kvs,
  overrides,
  hpRefresh,
  textlinks,
  wpPlus,
  flags,
  subscriber,
  criteo,
  dynamicRightRailAds

){

  //build commercialNode
  window.commercialNode = zoneBuilder.exec();

  //extend with wp specific flags:
  utils.extend(utils.flags, flags);

  //extend or add keyvalues at the ad level
  //each key can accept a function, or an array of functions
  utils.merge(Ad.prototype.keyvaluesConfig, {
    ad: function(){
      if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
        return config.adTypes[this.config.what].keyvalues.ad;
      }
    },
    pos: function(){
      var c = config.adTypes[this.config.pos];
      return c && c.keyvalues && c.keyvalues.pos || false;
    }
  });

  //Custom flight templates that require additional conditionals
  /*config.flights = utils.extend({
    interstitial: {
      what: ['interstitial'],
      test: [utils.showInterstitial && !utils.flags.front]
    }
  }, config.flights);*/


  //integrate tiffany tiles from tiffany tile publisher
  if(window.wpAd && window.wpAd.config && window.wpAd.config.tiffanyTiles){
    config.flights = $.extend(utils.clone(window.wpAd.config.tiffanyTiles), config.flights);
  }

  //overrides config
  utils.extend(Ad.prototype.overrides, overrides);

  //subscribe promos
  $(document).on('onTwpMeterReady', function(){
    if(flags.pageType.homepage){
      if(window.wpAd && window.wpAd.adsOnPage &&
      !window.wpAd.adsOnPage.pushdown &&
      !window.wpAd.adsOnPage.leaderboard &&
      !(window.wpAd.flags && window.wpAd.flags.disableSubscribePromo)){

        //placeholder for actual creative code
        var code = '';

        if(subscriber()){
          //show welcome message
          code = '<img src="http://img.wpdigital.net/wp-srv/ad/img/welcome-1-970x66.png" height="66" width="970" alt="" style="border:0;outline:0;" />';
        } else {
          //show subscribe message
          code = '<a href="https://account.washingtonpost.com/acquisition/?promo=dgbanrad&destination&tid=signup_HP5">' +
            '<img src="//img.wpdigital.net/wp-srv/ad/img/meter-promo-01-970x66.png" alt="Digital subscriptions starting at $0.99. Click here to subscribe." width="970" height="66" style="border:0;outline:0;" />' +
          '</a>';
        }

        $('#wpni_adi_pushdown').removeClass('slug').append(code).css({display: 'block'});
        $('#slug_pushdown').css({display: 'block'});

      }
    } else if((flags.pageType.article || flags.pageType.front) && !subscriber()){
      //leverage existing logic for now
      utils.ajax({
        url: 'http://js.washingtonpost.com/wp-srv/ad/subscribePromo.js'
      });
    }
  });


  //this is wpAd
  return utils.extend(defaultSettings, {

    criteo: criteo.exec(),

    deferred: {
      //Array of deferred functions to execute on $(window).load
      windowLoad: [

        //WP+ tracking and config
        wpPlus.exec,

        //20999 - JH - brand connect tracking and config:
        function(){
          if($('div.brand-connect-module').length){
            utils.ajax({
              url: 'http://js.washingtonpost.com/wp-srv/ad/min/brandConnectTracking.js',
              success: function(data){
                if(wpAd.brandConnect && wpAd.brandConnect.init){
                  wpAd.brandConnect.init();
                }
              }
            });
          }
        }
      ],
      //Array of deferred functions to execute on $(window).load
      domReady: [
        function(){
          if(/dynamic-ad-loading/.test(window.location.search) && flags.pageType.article){
            dynamicRightRailAds.init({
              count: 2,
              spacing: 500,
              pos: 'flex_ss_bb_hp',
              classes: 'ads slug flex_ss_bb_hp rr'
            });
            /*dynamicInlineAds.init({
              count: 12,
              pos: 'inline_bb'
            });*/
          }
        }
      ]
    },

    textlinks: textlinks,

    hpRefresh: hpRefresh.exec(),

    constants: {
      dfpSite: '/701/wpni.',
      domain: 'washingtonpost.com'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: false,
      keyvaluesConfig: kvs
    }),

    //ad spots and flights
    config: config,

    //determine open ad spots
    flights: templateBuilder.exec(config.flights),

    cleanScriptTags: function(){
      // Found a call to this on a test page. Adding dummy function to prevent errors until we
      // figure out what to do with this, as it won't be needed when we switch to GPT
      return false;
    }

  });

});
