/**
 * washingtonpost.com site specific ad script (desktop)
 */
define([
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
  'criteo'

], function(
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
  criteo

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

  //this is wpAd
  return utils.extend(defaultSettings, {

    criteo: criteo.exec(),

    deferred: {
      //Array of deferred functions to execute on $(window).load
      windowLoad: [
        wpPlus.exec
      //, brandconnect
      //, subscribe promos
      //, etc
      ],
      //Array of deferred functions to execute on $(window).load
      domReady: [

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
