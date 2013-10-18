/*global placeAd2:true, placeAd2Queue */

// load dependencies:
// "siteScript" is defined in the site specific build file (eg: build/slate.js)
require(['gpt', 'siteScript', 'utils', 'jQuery', 'viewable'], function (gpt, wpAd, utils, $, vi){

  var queue = placeAd2.queue || [];

  $.fn.viewable = vi;

  //make sure these are defined:
  wpAd.adsOnPage = wpAd.adsOnPage || {};
  wpAd.adsDisabledOnPage = wpAd.adsDisabledOnPage || {};
  wpAd.debugQueue = wpAd.debugQueue || [];
  wpAd.init = wpAd.init || {};

  if(utils.flags.debug){
    utils.debug(queue);
  } else if($ && $.fn && $.fn.on/* && window.localStorage && localStorage.getItem('adops_debug_enabled')*/){
    $(document).on('keydown.wpAd', function(e){
      //if ctrl+f9 pressed
      if(e.ctrlKey && e.which === 120){
        utils.debug(queue);
        $(document).off('keydown.wpAd');
      }
    });
  }


  //dcnode commercialNode override functionality:
  if(utils.flags.dcnode){
    window.commercialNode = utils.flags.dcnode;
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
          delivery: arguments[2],
          onTheFly: arguments[3]
        },
        defaults = utils.clone(config),
        pos = config.what,
        posOverride = false,
        vi = typeof config.delivery === 'string' && config.delivery.toLowerCase() === 'vi',
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

        //viewable impression delivery
        if(vi){

          //set to call placeAd2 to actually render when in view
          //first, set some css so we can find its position on the page
          $('#slug_' + pos).css({
            width: wpAd.config.adTypes[config.what].size[0][0] + 'px',
            height: wpAd.config.adTypes[config.what].size[0][1] + 'px',
            display: 'block'
          //call the viewable method
          }).viewable({
            offset: 10,
            interval: 300,
            //on view:
            callback: function(){
              //reset above css
              $(this).css({
                height: '',
                width: '',
                display: ''
              });
              //render the ad
              placeAd2({what: defaults.what});
            }
          });

          if(utils.flags.debug){
            console.log('ADOPS DEBUG:' + pos + ' added to vi queue');
          }

        //normal delivery
        } else {
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

          if(utils.flags.debug){
            console.log('ADOPS DEBUG:' + pos + ' rendered', wpAd.adsOnPage[pos]);
          }

        }
      } else {
        wpAd.adsDisabledOnPage[pos] = true;
      }

      // always need to create this queue
      // unless its a viewable impression, in which case it is not "disabled", so we hold off on this
      if(!vi){
        wpAd.debugQueue.push(pos);
      }

    };

    // build and display queued up ads from previous placeAd2 calls
    utils.execPlaceAd2Queue(queue);

  });

  // expose utils for use in external ads, etc.
  wpAd.utils = utils;

  // expose wpAd to the window for debugging + external code to access/build off of.
  window.wpAd = utils.extend(wpAd, window.wpAd);

  //execute deferred functions
  if(wpAd.deferred.length){
    $(window).load(function(){
      var l = wpAd.deferred.length;
      for(var i = 0; i < l; i++){
        wpAd.deferred[i]();
      }
    });
  }

});
