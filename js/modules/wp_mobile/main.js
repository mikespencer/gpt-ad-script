/**
 * WP mobile web specific ad script
 */
define([
  'jQuery',
  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'zoneBuilder',
  'templateBuilder',
  'wp_mobile/config',
  'wp_mobile/keyvalues'

], function(
  $,
  defaultSettings,
  Ad,
  gptConfig,
  utils,
  zoneBuilder,
  templateBuilder,
  config,
  kvs
){

  //add mobile specific, ad level keyvalues
  /*merge(Ad.prototype.keyvaluesConfig, {

  });*/

  //build commercialNode
  window.commercialNode = zoneBuilder.exec();

  //this is wpAd
  var _wpAd = utils.extend(defaultSettings, {

    //set network id
    constants: {
      dfpSite: '/701/mob.wp.',
      domain: 'mob.wp'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: false,
      keyvaluesConfig: kvs
    }),

    config: config,

    flights: templateBuilder.exec(config.flights)

  });

  //leverage this from m.washingtonpost.com to render and hide/show fixedBottom Unit based on orientation
  if(window.enquire && window.Modernizr && window.Modernizr.positionfixed){
    window.enquire.register('only screen and (orientation: portrait) and (min-device-height: 480px)', {

      match: function(){
        if(window.console){
          window.console.log('SHOWING AD');
        }
        $('#slug_fixedBottom').css({
          display: 'block'
        });
      },

      // OPTIONAL, defaults to false
      // If set to true, defers execution of the setup function
      // until the first time the media query is matched
      deferSetup: true,

      // OPTIONAL
      // If supplied, triggered once, when the handler is registered.
      setup: function(){
        if(!_wpAd.flights.fixedBottom){
          if(window.console){
            window.console.log('SETTING UP AD');
          }
          window.wpAd.flights.fixedBottom = {
            id: 'fixedBottom'
          };
          window.placeAd2({
            what: 'fixedBottom'
          });
        }
      },

      unmatch: function(){
        if(window.console){
          window.console.log('HIDING AD');
        }
        $('#slug_fixedBottom').css({
          display: 'none'
        });
      },

      destory: function(){}

    }).listen();
  }

  //check to refresh ads if page content is prefetched
  var previousURL = window.location.href;
  setInterval(function(){
    if(previousURL !== window.location.href && wpAd.adsOnPage){
      previousURL = window.location.href;
      for(var key in wpAd.adsOnPage){
        if(wpAd.adsOnPage.hasOwnProperty(key)){
          wpAd.adsOnPage[key].refresh();
        }
      }
    }
  }, 2000);

  return _wpAd;

});
