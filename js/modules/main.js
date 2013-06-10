/*global placeAd2:true, placeAd2Queue */

// load dependencies:
// "siteScript" is defined in the site specific build file (eg: build/slate.js)
require(['gpt', 'siteScript', 'utils', 'jquery'], function (gpt, wpAd, utils, $){

  var queue = placeAd2.queue || [];

  //make sure these are defined:
  wpAd.adsOnPage = wpAd.adsOnPage || {};
  wpAd.adsDisabledOnPage = wpAd.adsDisabledOnPage || {};
  wpAd.debugQueue = wpAd.debugQueue || [];
  wpAd.init = wpAd.init || {};

  if(utils.flags.debug){
    utils.debug(queue);
  } else if($ && $.fn && $.fn.bind){
    $('body').bind('keypress.wpAd', function(e){
      //CHROME: ctrl+f9 = 63244
      if(e.keyCode === 63244){
        utils.debug(queue);
        $('body').unbind('keypress.wpAd');
      }
    });
  }

  //Insert interstitial at the beginning of placeAd2.queue
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
         ((wpAd.flights && wpAd.flights[pos] || wpAd.flights[config.what + '*']) || utils.flags.allAds)){
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
    utils.execPlaceAd2Queue(queue);

  });

  // expose utils for use in external ads, etc.
  wpAd.utils = utils;

  // expose wpAd to the window for debugging + external code to access/build off of.
  window.wpAd = wpAd;

});