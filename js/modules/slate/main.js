/**
 * slate.com site specific ad script (desktop)
 */
define([

  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'templateBuilder',
  'slate/config',
  'slate/keyvalues',
  'slate/overrides',
  'slate/galleryRefresh'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  utils,
  templateBuilder,
  config,
  kvs,
  overrides,
  galleryRefresh

){

  //extend or add keyvalues at the ad level
  //each key can accept a function, or an array of functions
  utils.merge(Ad.prototype.keyvaluesConfig, {
    ad: function(){
      if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
        return config.adTypes[this.config.what].keyvalues.ad;
      }
    }
  });

  //Custom flight templates that require additional conditionals
  /*config.flights = utils.extend({
    interstitial: {
      what: ['interstitial'],
      test: [utils.showInterstitial && !utils.flags.front]
    }
  }, config.flights);*/

  //overrides config
  utils.extend(Ad.prototype.overrides, overrides);

  //ad refresh on gallery pages
  window.wpniAds = window.wpniAds || {};
  window.wpniAds.gallery = galleryRefresh;

  return utils.extend(defaultSettings, {

    constants: {
      dfpSite: '/701/slate.',
      domain: 'slate.com'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: false,
      keyvaluesConfig: kvs
    }),

    config: config,

    //determine open ad spots
    flights: templateBuilder.exec(config.flights)

  });
});