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
  if(_wpAd.flights.fixedBottom){
    window.addEventListener('orientationchange', function() {
      //landscape
      if(window.innerWidth > window.innerHeight){
        $('#slug_fixedBottom').css({
          display: 'none'
        });
      //portrait
      } else {
        $('#slug_fixedBottom').css({
          display: 'block'
        });
      }
    }, false);
  }

  return _wpAd;

});
