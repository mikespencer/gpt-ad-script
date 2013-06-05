/**
 * WP mobile web specific ad script
 */
define([
  'modules/defaultSettings',
  'modules/Ad',
  'modules/gptConfig',
  'modules/utils',
  'modules/wp_mobile/config',
  'modules/wp_mobile/keyvalues'
], function(defaultSettings, Ad, gptConfig, utils, config, kvs){

  //add mobile specific, ad level keyvalues
  /*merge(Ad.prototype.keyvaluesConfig, {

  });*/

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

    flags: utils.flags,

    config: config,

    flights: {
      t: {
        id: 'default'
      }
    }

  });

});