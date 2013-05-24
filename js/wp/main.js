/**
 * washingtonpost.com site specific ad script (desktop)
 */
define([

  'defaultSettings',
  'Ad',
  'gptConfig',
  'utils/zoneBuilder',
  'utils/templateBuilder',
  'utils/extend',
  'utils/merge',
  'utils/showInterstitial',
  'utils/flags',
  'wp/config',
  'wp/keyvalues',
  'wp/overrides'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  zoneBuilder,
  templateBuilder,
  extend,
  merge,
  showInterstitial,
  flags,
  config,
  kvs,
  overrides

){

  //build commercialNode
  commercialNode = zoneBuilder.exec();
  console.log(commercialNode);
  //extend or add keyvalues at the ad level
  //each key can accept a function, or an array of functions
  merge(Ad.prototype.keyvaluesConfig, {
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
  config.flights = extend({
    interstitial: {
      what: ['interstitial'],
      test: [showInterstitial && !flags.front]
    }
  }, config.flights);

  //overrides config
  extend(Ad.prototype.overrides, overrides);

  return extend(defaultSettings, {

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

    flags: flags,

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