/*global placeAd2:true, placeAd2Queue */
/*jshint indent:2*/

// load dependencies:
// "siteScript" is defined in the site specific build file (eg: build/slate.js)
require(['siteScript', 'utils/getScript'], function (wpAd, getScript){

  var queue = placeAd2.queue || false;

  if(wpAd.flags.debug){
    getScript('js/debug.js');
    try{console.log('placeAd2 queue:', queue);}catch(e){}
  }

  // add to placeAd2 queue
  placeAd2(commercialNode, 'interstitial', false, '');

  googletag.cmd.push(function(){

    placeAd2 = function(where, what, del, onTheFly){

      var pos = what,
        posOverride = false,
        posArray,
        ad;

      // determine pos value and potential posOverride
      if(/\|/.test(what)){
        posArray = what.split(/\|/);
        what = posArray[0];
        posOverride = posArray[1];
        pos = posArray.join('_');
      }

      // if the ad type is legit, open and hasn't already been built/rendered on the page
      if(wpAd.config.adTypes[what] &&
         ((wpAd.flights && wpAd.flights[pos] || wpAd.flights[what + '*']) || wpAd.flags.allAds)){

        if(!wpAd.adsOnPage[pos]){

          // build and store our new ad
          ad = new wpAd.Ad({
            templateSettings: wpAd.config.adTypes[what],
            dfpSite: wpAd.constants.dfpSite,
            where: window.commercialNode,
            size: wpAd.config.adTypes[what].size,
            what: what,
            pos: pos,
            posOverride: posOverride,
            hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false,
            onTheFly: onTheFly
          });

          // overrides (the new hackbin)
          if(wpAd.overrides){
            ad = wpAd.overrides.exec(ad);
          }

          // display the gpt ad
          ad.render();

          // store for debugging
          wpAd.adsOnPage[pos] = ad;

        } else{
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