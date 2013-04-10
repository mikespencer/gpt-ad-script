define([
  'utils/allAds',
  'utils/debug',
  'utils/front',
  'utils/no_interstitials'
], function(allAds, debug, front, no_interstitials){

  return {
    allAds: allAds,
    debug: debug,
    front: front,
    no_interstitials: no_interstitials
  };

});