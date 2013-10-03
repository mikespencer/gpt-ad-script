/**
 * WP mobile web specific ad script
 */
define([
  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'templateBuilder',
  'slate_mobile/config',
  'slate_mobile/keyvalues'
], function(
  defaultSettings,
  Ad,
  gptConfig,
  utils,
  templateBuilder,
  config,
  kvs
){

  //add mobile specific, ad level keyvalues
  /*merge(Ad.prototype.keyvaluesConfig, {

  });*/

  //this is wpAd
  return utils.extend(defaultSettings, {

    //set network id
    constants: {
      dfpSite: '/701/mob.slate.',
      domain: 'mob.slate'
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

});