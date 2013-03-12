/*global requirejs, placeAd2:true, placeAd2Queue */

/**
 *  Universal script that does adops initialisation and determines and loads site specific ad script/s
 */
(function(w, d, requirejs, define){

  'use strict';

  //potential site specific scripts/modules with attribute mapping 
  var siteMapping = {
      wp: 'wp',
      slate: 'slate',
      theroot: 'root',
      mobile: 'mobile'
    },

    //requirejs configuration
    dev_config = {
      baseUrl: 'js/modules',
      paths: {
        'gpt': 'http://www.googletagservices.com/tag/js/gpt',
        'jquery': 'http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1'
      },
      shim: {
        'gpt': {
          exports: 'googletag'
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
  requirejs([siteScript, 'gpt'], function (wpAd, googletag){

    if(wpAd.flags.debug){
      wpAd.debugQueue = [];
      requirejs(['debug'], function(debug){
        debug.init();
      });
    }

    //call any queued up functions
    if(wpAd.init && typeof wpAd.init === 'object'){
      var len = wpAd.init.length,
        i = 0;
      for(i;i<len;i++){
        if(typeof wpAd.init[i] === 'function'){
          wpAd.init[i]();
        }
      }
    }

    //initialise GPT
    wpAd.gpt_config = new wpAd.GPTConfig({
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

      //if the ad type is legit and hasn't already been build/rendered on the page
      if(wpAd.config.adTypes[what]){
        if(!wpAd.template[pos]){

          //build and store our new ad
          ad = new wpAd.Ad({
            templateSettings: wpAd.config.adTypes[what],
            dfpSite: wpAd.dfpSite,
            where: w.commercialNode,
            size: wpAd.config.adTypes[what].size,
            what: what,
            pos: pos,
            posOverride: posOverride
          });

          //overrides (the new hackbin)
          if(wpAd.overrides){
            ad = wpAd.overrides.exec(ad);
          }

          //display the gpt ad
          ad.render();

          //store for debugging
          wpAd.template[pos] = ad;

        } else{
          //refresh if ad/spot already rendered
          wpAd.template[pos].slot.refresh();
        }
      }

      if(wpAd.flags.debug){
        wpAd.debugQueue.push(ad);
      }
      try{
        w.console.log('RENDERED AD:\n', ad.config.pos + '\n', ad);
      }catch(e){}

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
        //console.time('placeAd2');
        placeAd2.apply(window, queue[i]);
        //console.timeEnd('placeAd2');
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