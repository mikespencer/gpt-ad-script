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
  'utils/front',
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
  front,
  showInterstitial,
  flags,
  config,
  kvs,
  overrides

){

  //build commercialNode
  commercialNode = zoneBuilder.exec();

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
      if(c && c.keyvalues && c.keyvalues.pos){
        return c.keyvalues.pos;
      }
    }
  });

  //add page specific keyvalues
  merge(gptConfig.keyvaluesConfig, kvs);

  //Custom flight templates that require additional conditionals
  config.flights = extend({
    interstitial: {
      what: ['interstitial'],
      test: [showInterstitial && !front]
    }
  }, config.flights);

  return extend(defaultSettings, {

    constants: {
      dfpSite: '/701/wpni.',
      domain: 'washingtonpost.com'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: true
    }),

    flags: flags,

    config: config,

    //determine open ad spots
    flights: templateBuilder.exec(config.flights),

    //overrides
    overrides: overrides,

    cleanScriptTags: function(){
      // Found a call to this on a test page. Adding dummy function to prevent errors until we
      // figure out what to do with this, as it won't be needed when we switch to GPT
      return false;
    }

  });
});