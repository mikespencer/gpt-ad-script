/**
 * WP mobile web specific ad script
 */
define([
  'defaultSettings',
  'Ad',
  'GPTConfig',
  'utils',
  'wp_mobile/config',
  'wp_mobile/keyvalues'
], function(defaultSettings, Ad, gptConfig, utils, config, kvs){

  //add mobile specific, ad level keyvalues
  /*merge(Ad.prototype.keyvaluesConfig, {

  });*/

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

    //simulate what templatBuilder would return, without the cost of including/executing it
    flights: {
      t: {
        id: 'default'
      }
    }

  });

});