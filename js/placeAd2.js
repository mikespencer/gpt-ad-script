(function(){

  'use strict';

  define(function(){

    return function(where, what, del, onTheFly){
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

  });

})();