/**
 * washingtonpost.com site specific ad script (desktop)
 */
define([

  'modules/defaultSettings',
  'modules/Ad',
  'modules/GPTConfig',
  'modules/utils',
  'modules/zoneBuilder',
  'modules/templateBuilder',
  'modules/wp/config',
  'modules/wp/keyvalues',
  'modules/wp/overrides'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  utils,
  zoneBuilder,
  templateBuilder,
  config,
  kvs,
  overrides

){

  //build commercialNode
  commercialNode = zoneBuilder.exec();

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
  config.flights = utils.extend({
    interstitial: {
      what: ['interstitial'],
      test: [utils.showInterstitial && !utils.flags.front]
    }
  }, config.flights);

  //overrides config
  utils.extend(Ad.prototype.overrides, overrides);

  return utils.extend(defaultSettings, {

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

    flags: utils.flags,

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