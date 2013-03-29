/*global placeAd2:true, placeAd2Queue */
/*jshint indent:2*/

/**
 * Universal script that does adops initialisation and loads site specific ad script
 */
(function(){

  'use strict';

  //no_ads flag test:
  if(/no_ads/.test(location.search)){
    return false;
  }

  //configure requirejs;
  require.config({
    baseUrl: 'js',
    paths: {
      //remove from optimized script
      'siteScript': 'wp/main',
      'googletag': 'http://www.googletagservices.com/tag/js/gpt',
      'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
      'jqueryUI': 'lib/jquery-ui.min'
    },
    shim: {
      'googletag': {
        exports: 'googletag'
      },
      'jqueryUI':{
        deps: ['jquery'],
        exports: '$'
      }
    }
  });

  //load dependencies:
  require(['siteScript', 'utils/getScript'], function (wpAd, getScript){

    if(wpAd.flags.debug){
      wpAd.debugQueue = wpAd.debugQueue || [];
      getScript('js/debug.js');
    }

    //add to placeAd2queue
    placeAd2(commercialNode, 'interstitial', false, '');

    //redefine placeAd2
    placeAd2 = function(where, what, del, onTheFly){
      var pos = what,
        posOverride = false,
        posArray,
        ad;

      //determine pos value and potential posOverride
      if(/\|/.test(what)){
        posArray = what.split(/\|/);
        what = posArray[0];
        posOverride = posArray[1];
        pos = posArray.join('_');
      }

      //if the ad type is legit, open and hasn't already been built/rendered on the page
      if((wpAd.flights && wpAd.flights[pos] || wpAd.flights[what + '*']) && wpAd.config.adTypes[what] || wpAd.flags.allAds){
        if(!wpAd.adsOnPage[pos]){

          //build and store our new ad
          ad = new wpAd.Ad({
            templateSettings: wpAd.config.adTypes[what],
            dfpSite: wpAd.dfpSite,
            where: window.commercialNode,
            size: wpAd.config.adTypes[what].size,
            what: what,
            pos: pos,
            posOverride: posOverride,
            hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false,
            onTheFly: onTheFly
          });

          //overrides (the new hackbin)
          if(wpAd.overrides){
            ad = wpAd.overrides.exec(ad);
          }

          //display the gpt ad
          ad.render();

          //store for debugging
          wpAd.adsOnPage[pos] = ad;

        } else{
          //refresh if ad/spot already rendered
          wpAd.adsOnPage[pos].slot.refresh();
        }

      } else {
        wpAd.adsDisabledOnPage[pos] = true;
      }

      if(wpAd.flags.debug){
        wpAd.debugQueue.push(pos);
      }

    };

    //build and display queued up ads from previous placeAd2 calls
    callPlaceAd2Queue(window.placeAd2Queue);

    //expose wpAd to the window for debugging + external code to access/build off of.
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

})();