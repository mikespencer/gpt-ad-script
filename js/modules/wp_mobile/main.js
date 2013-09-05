/**
 * WP mobile web specific ad script
 */
define([
  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'zoneBuilder',
  'templateBuilder',
  'wp_mobile/config',
  'wp_mobile/keyvalues'
], function(
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
  return utils.extend(defaultSettings, {

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

    // simulate what templatBuilder would return, without the cost of including/executing it
    /*flights: {
      t: {
        id: 'default'
      }
    }*/

  });

});