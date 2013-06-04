/*global placeAd2:true, placeAd2Queue */
/*jshint indent:2*/

// load dependencies:
// "siteScript" is defined in the site specific build file (eg: build/slate.js)
require(['gpt', 'siteScript', 'utils'], function (googletag, wpAd, utils){

  var queue = placeAd2.queue || [];

  //make sure these are defined:
  wpAd.adsOnPage = wpAd.adsOnPage || {};
  wpAd.adsDisabledOnPage = wpAd.adsDisabledOnPage || {};
  wpAd.debugQueue = wpAd.debugQueue || [];
  wpAd.init = wpAd.init || {};

  if(wpAd.flags.debug){
    utils.getScript('js/debug.js');
    try{console.log('placeAd2 queue:', queue);}catch(e){}
  }

  //Insert interstitial at the beginnig of the queue
  queue.unshift([{
    what: 'interstitial'
  }]);

  googletag.cmd.push(function(){

    placeAd2 = function(){

      var config = arguments.length === 1 && utils.isObject(arguments[0]) ? arguments[0] : {
          //for backwards compat with legacy inline placeAd2 calls
          where: arguments[0],
          what: arguments[1],
          onTheFly: arguments[3]
        },
        pos = config.what,
        posOverride = false,
        posArray,
        ad;

      // determine pos value and potential posOverride
      if(/\|/.test(config.what)){
        posArray = config.what.split(/\|/);
        config.what = posArray[0];
        posOverride = posArray[1];
        pos = posArray.join('_');
      }

      // if the ad type is legit, open and hasn't already been built/rendered on the page
      if(wpAd.config.adTypes[config.what] &&
         ((wpAd.flights && wpAd.flights[pos] || wpAd.flights[config.what + '*']) || wpAd.flags.allAds)){

        if(!wpAd.adsOnPage[pos]){

          // build and store our new ad
          ad = new wpAd.Ad({
            templateSettings: wpAd.config.adTypes[config.what],
            dfpSite: wpAd.constants.dfpSite,
            where: window.commercialNode,
            //where: config.where,
            size: wpAd.config.adTypes[config.what].size,
            what: config.what,
            pos: pos,
            posOverride: posOverride,
            hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false,
            onTheFly: config.onTheFly
          });

          // display the gpt ad
          ad.render();

          // store for debugging
          wpAd.adsOnPage[pos] = ad;

        } else {
          // refresh if ad/spot already rendered
          wpAd.adsOnPage[pos].refresh();
        }

      } else {
        wpAd.adsDisabledOnPage[pos] = true;
      }

      // always need to create this queue
      wpAd.debugQueue.push(pos);

    };

    // build and display queued up ads from previous placeAd2 calls
    callPlaceAd2Queue(queue);

  });

  // expose wpAd to the window for debugging + external code to access/build off of.
  window.wpAd = wpAd;

});

/**
 * Calls queued up placeAd2 calls when placeAd2 is redefined above
 */
function callPlaceAd2Queue(queue){
  if(queue){
    var l = queue.length,
      i = 0;
    for(i;i<l;i++){
      placeAd2.apply(window, queue[i]);
    }
  }
}