/**
 * WP mobile web specific ad script
 */
define([
  'defaultSettings',
  'Ad',
  'gptConfig',
  'wp_mobile/config',
  'wp_mobile/keyvalues',
  'utils/extend',
  'utils/merge',
  'utils/flags'
], function(defaultSettings, Ad, gptConfig, config, kvs, extend, merge, flags){

  //add mobile specific, ad level keyvalues
  /*merge(Ad.prototype.keyvaluesConfig, {

  });*/

  return extend(defaultSettings, {

    //set network id
    constants: {
      dfpSite: '/701/mob.wp.',
      domain: 'mob.wp'
    },

    //Ad builder
    Ad: Ad,

    //Initial GPT setup
    gptConfig: gptConfig.init({
      sra: true,
      keyvaluesConfig: kvs
    }),

    flags: flags,

    config: config,

    flights: {
      t: {
        id: 'default'
      }
    }

  });

});