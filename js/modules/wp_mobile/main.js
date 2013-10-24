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


  //add listener to hide/show fixed ad based on orientation. Hide for landscape, show for portrait.
  window.addEventListener('resize', onOrientationChange, false);
  window.addEventListener('orientationchange', onOrientationChange, false);

  //store orientation in case resize and orientationchange events both fire, to prevent double ad call:
  var orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

  //orientation change callback
  function onOrientationChange(){
    //if page loaded in landscape, fixedBotton will be disabled.
    //rebuild the flights object and make placeAd2 call.
    if(!_wpAd.flights.fixedBottom){
      window.wpAd.flights = templateBuilder.exec(config.flights);
      window.placeAd2({
        what: 'fixedBottom'
      });
    }
    //landscape
    if(window.innerWidth > window.innerHeight && orientation !== 'landscape'){
      orientation = 'landscape';
      $('#slug_fixedBottom').css({
        display: 'none'
      });
    //portrait
    } else if(orientation !== 'portrait'){
      orientation = 'portrait';
      $('#slug_fixedBottom').css({
        display: 'block'
      });
    }
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
