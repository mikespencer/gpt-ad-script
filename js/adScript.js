/*global placeAd2:true, placeAd2Queue */

/**
 * Universal script that does adops initialisation and loads site specific ad script
 */
(function(w, d, requirejs, define){

  'use strict';

  //no_ads flag test:
  if(/no_ads/.test(location.search)){
    return false;
  }

  //potential site specific scripts/modules with attribute mapping 
  var siteMapping = {
      wp: 'wp/main',
      slate: 'slate/main',
      theroot: 'theroot/main',
      wp_mobile: 'wp_mobile/main'
    },

    //requirejs configuration
    dev_config = {
      baseUrl: 'js/modules',
      paths: {
        'googletag': 'http://www.googletagservices.com/tag/js/gpt',
        'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',
        'jqueryUI': 'http://code.jquery.com/ui/1.10.1/jquery-ui'
      },
      shim: {
        'gpt': {
          exports: 'googletag'
        },
        'jqueryUI':{
          deps: ['jquery'],
          exports: '$'
        }
      }
    },

    //single request architecture
    sra = false,

    //async rendering
    async = true,

    //determine site script or default to 'wp'
    siteScript = siteMapping[getSite()] || 'wp';


  //configure requirejs;
  requirejs.config(dev_config);

  //load dependencies:
  requirejs([siteScript, 'googletag'], function (wpAd, googletag){

    if(wpAd.flags.debug){
      wpAd.debugQueue = [];

      //could even potentially pull this out completely, tweak and have as a bookmarklet...
      requirejs(['debug'], function(debug){
        debug.init();
      });

    }

    //initialise GPT
    wpAd.gptConfig = wpAd.gptConfig.init({
      googletag: w.googletag,
      sra: false
    });

    //redefine placeAd2
    placeAd2 = function(where, what, del, otf){
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
            where: w.commercialNode,
            size: wpAd.config.adTypes[what].size,
            what: what,
            pos: pos,
            posOverride: posOverride,
            hardcode: wpAd.flights[pos] && wpAd.flights[pos].hardcode || false
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

        if(wpAd.flags.debug){
          wpAd.debugQueue.push(wpAd.adsOnPage[pos]);
        }

      }

    };

    //build and display queued up ads from previous placeAd2 calls
    callPlaceAd2Queue(window.placeAd2Queue);

    //expose wpAd to the window for debugging + external code to access/build off of.
    w.wpAd = wpAd;

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

  /**
   * Returns the site specific script, or returns false if unable to determine
   */
  function getSite(){
    var adScript = d.getElementById('adScript'),
      scripts =  adScript ? [adScript] : d.getElementsByTagName('script'),
      l = scripts.length,
      attr;
    while(l--){
      attr = scripts[l].getAttribute('data-adops-site');
      if(attr){
        return attr;
      }
    }
    return false;
  }

})(window, document, window.requirejs, window.define);