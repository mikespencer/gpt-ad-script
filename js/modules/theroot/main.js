/**
 * slate.com site specific ad script (desktop)
 */
define([

  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'templateBuilder',
  'theroot/config',
  'theroot/keyvalues',
  'theroot/overrides',
  'criteo'

], function(

  defaultSettings,
  Ad,
  gptConfig,
  utils,
  templateBuilder,
  config,
  kvs,
  overrides,
  criteo

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


  return utils.extend(defaultSettings, {

    criteo: criteo.exec(),

    constants: {
      dfpSite: '/701/roots.',
      domain: 'theroot.com'
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
    flights: templateBuilder.exec(config.flights),

  });
});