/**
 * slate.com site specific ad script (desktop)
 */
define([

  'defaultSettings',
  'Ad',
  'gptConfig',
  'utils/templateBuilder',
  'utils/extend',
  'utils/merge',
  'utils/showInterstitial',
  'utils/flags',
  'slate/config',
  'slate/keyvalues',
  'slate/overrides',
  'slate/galleryRefresh'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  templateBuilder,
  extend,
  merge,
  showInterstitial,
  flags,
  config,
  kvs,
  overrides,
  galleryRefresh

){

  //extend or add keyvalues at the ad level
  //each key can accept a function, or an array of functions
  merge(Ad.prototype.keyvaluesConfig, {
    ad: function(){
      if(config.adTypes[this.config.what].keyvalues && config.adTypes[this.config.what].keyvalues.ad){
        return config.adTypes[this.config.what].keyvalues.ad;
      }
    }
  });

  //Custom flight templates that require additional conditionals
  config.flights = extend({
    interstitial: {
      what: ['interstitial'],
      test: [showInterstitial && !flags.front]
    }
  }, config.flights);

  //overrides config
  extend(Ad.prototype.overrides, overrides);

  //ad refresh on gallery pages
  window.wpniAds = window.wpniAds || {};
  window.wpniAds.gallery = galleryRefresh;

  return extend(defaultSettings, {

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

    flags: flags,

    config: config,

    //determine open ad spots
    flights: templateBuilder.exec(config.flights)

  });
});