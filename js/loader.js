/**
 * Script loader for adops. Defines, loads and executes necessary ad dependencies based on site.
 */
var placeAd2, wpAd = wpAd || {}, googletag = googletag || { cmd: [] };

(function(w, d, $){

  'use strict';

  if(/no_ads/.test(location.search)){
    return false;
  }

  //Test for referencing local versions of files for testing
  var localhost = /localhost/.test(d.domain),

    //debugging flag
    debug = !!(/debugadcode/i.test(location.search)),

    //safety check for console
    hasConsole = w.console && typeof w.console.log === 'function',

    //base url for site scripts
    baseURL = localhost ? 'js/min/' : 'http://js.washingtonpost.com/wp-srv/ad/loaders/latest/js/min/',

    //URL for jQuery to load if not already defined on the page
    jQueryURL = 'http://js.washingtonpost.com/wpost/js/combo/?token=201210102320000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',

    //device detection
    device = (function(ua){

      var mobileKey,
        tabletKey,

        //width settings:
        mobileThreshold = 768,
        thisWidth = w.innerWidth || w.screen && w.screen.width,
        isMobileWidth = thisWidth < mobileThreshold,

        //set default mobile/tablet flags to false:
        isMobile = false,
        isTablet = false,

        //mobile tests:
        mobile = {
          iOS: (/iphone|ipad|ipod/i).test(ua),
          Android: (/android/i).test(ua),
          BlackBerry: (/blackberry/i).test(ua),
          Windows: (/iemobile/i).test(ua),
          FirefoxOS: (/mozilla/i).test(ua) && (/mobile/i).test(ua)
        },

        //tablet tests:
        tablet = {
          iPad: (/ipad/i).test(ua)
        };

      //check if mobile:
      for(mobileKey in mobile){
        if(mobile.hasOwnProperty(mobileKey) && mobile[mobileKey]){
          isMobile = true;
          break;
        }
      }

      //check if tablet:
      for(tabletKey in tablet){
        if(tablet.hasOwnProperty(tabletKey) && tablet[tabletKey]){
          tablet = true;
          break;
        }
      }

      return {
        mobile: mobile,
        tablet: tablet,
        isMobile: isMobile,
        isTablet: isTablet,
        width: thisWidth,
        isMobileWidth: isMobileWidth
      };

    })(navigator.userAgent);


  /**
   * Determines the site specific script to load based on this script tag's data-ad-site attribute.
   * Also checks for data-ad-page-type for responsive pages, and loads appropriate script based on
   * our device object (above).
   * @return {String} File name of site script to load.
   */
  function getSiteInfo(){
    var siteScripts = {
        'wp': 'wp.min.js',
        'theroot': 'theroot.min.js',
        'slate': 'slate.min.js',
        'wp_mobile': 'wp_mobile.min.js'
      },
      $target = $('script[data-ad-site]:first'),
      responsive = $target.data('adPageType') === 'responsive',
      site = $target.data('adSite'),
      script = siteScripts[site];

    //set some default fallbacks
    if(!siteScripts[site]){
      if(hasConsole){
        w.console.log('--ADOPS DEBUG-- Could not find attribute "data-ad-site" or a corresponding value. Defaulting to wp.min.js.');
      }
      site = 'wp';
      script = siteScripts.wp;
    }

    //if responsive page and mobile device, update script reference to mobile version
    if(responsive && device.isMobile && device.isMobileWidth){
      site += /_mobile$/.test(site) ? '' : '_mobile';
      if(debug && hasConsole){
        w.console.log('--ADOPS DEBUG-- Resposive page detected. Attempting to use script:', script);
      }
    }

    if(debug && hasConsole){
      w.console.log('--ADOPS DEBUG-- Loading site script:', script);
    }

    //return siteScripts.wp;
    return {
      script: script,
      site: site
    }
  }

  /**
   * Gets all ad containers on the page, loops through them, and calls placeAd2 for each based on
   * data attributes.
   */
  function displayAds(){
    $('*[id^="slug_"][data-ad-type]').hide().each(function(){
      var $this = $(this);
      placeAd2({
        where: $this.data('adWhere') || w.commercialNode,
        what: $this.data('adType'),
        del: $this.data('adDelivery'),
        otf: $this.data('adOnTheFly')
      });
    });
  }

  /**
   * Load site specific CSS
   * @param {String} site Name of site. Should match name of CSS file
   */
  function loadSiteCSS(site){
    if(site){
      $('<link />').attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: (localhost ? 'css/' : 'http://css.wpdigital.net/wp-srv/ad/loaders/latest/css/') + site + '.css'
      }).appendTo('head');
    }
  }

  /**
   * The placeAd2 function that will "actually" build ad calls is not defined at this point. This is
   * a placeholder that stores the arguments for each placeAd2 call in the placeAd2.queue Array as a
   * series of Arrays. placeAd2.queue is looped through once placeAd2 and it's dependencies are
   * properly defined/loaded in main.js and calls the new placeAd2 function for each, passing in the
   * stored arguments.
   */
  placeAd2 = function () {
    placeAd2.queue = placeAd2.queue || [];
    //convert args to an Array and add to queue:
    placeAd2.queue.push(Array.prototype.slice.call(arguments));
  };

  /**
   * Once jQuery is defined, this is called. Ajax's in site specific script and builds placeAd2.queue.
   */
  function init(){
    var siteInfo = getSiteInfo(),
      scriptURL = baseURL + siteInfo.script;

    //store our version of jQuery
    wpAd.$ = $;

    //store device info
    wpAd.device = device;

    loadSiteCSS(siteInfo.site);

    // get site specific ad script
    $.ajax({
      url: scriptURL,
      cache: true,
      dataType: 'script',
      crossDomain: true,
      timeout: 4000,
      error: function(err){
        if(hasConsole){
          w.console.log('--ADOPS DEBUG-- AdOps site script failed to load:', err);
        }
      },
      success: function(){
        if(debug && hasConsole){
          w.console.log('--ADOPS DEBUG--', scriptURL, 'loaded');
        }
      }
    });
    displayAds();
  }

  /**
   * Helper function to load scripts. Used here to load jQuery if it is not present on the page.
   * @param {String|Object} src URL of script to load. Optionally pass in as Object to override type.
   * @param {Function} opt_callback Optional callback function once the script has loaded.
   */
  function loadScript(src, opt_callback) {
    var s = d.createElement('script');
    var target = d.body || d.getElementsByTagName('head')[0] || false;
    opt_callback = opt_callback || false;
    if(target){
      s.type = 'text/' + (src.type || 'javascript');
      s.src = src.src || src;
      s.async = true;
      if(typeof opt_callback === 'function'){
        s.onreadystatechange = s.onload = function() {
          var state = s.readyState;
          if (!opt_callback.done && (!state || /loaded|complete/.test(state))) {
            opt_callback.done = true;
            opt_callback();
          }
        };
      }
      target.appendChild(s);
    }
  }


  /**
   * Checks version strings and returns true if 'thisVer' is more recent than or equal to 'minVer'
   * @param {String} thisVer The version to check
   * @param {String} minVer Minimum version to check against
   * @return {Boolean} true if the current version is OK, false if it is not
   */
  function versionChecker(thisVer, minVer){
    if(!thisVer || !minVer){
      return false;
    }

    var _test, _min;

    thisVer = thisVer.split('.');
    minVer = minVer.split('.');

    for(var i=0;i<minVer.length;i++){
      if(thisVer[i] !== 'undefined'){

        _test = parseInt(thisVer[i], 10);
        _min = parseInt(minVer[i], 10);

        if(_test !== _min){
          return _test > _min;
        }
      }
    }
    return true;
  }


  /**
   * We have to be very careful about overwriting a given page's jQuery. This is messy, but effective.
   * These following series of checks attempts to normalises jQuery and makes sure that we are using
   * version >= 1.7.1, without overwriting the current page's $ or jQuery (if exists) objects.
   * Our jQuery will be stored in wpAd.$ once init() is called. We should always try to reference
   * wpAd.$ in future.
   */

  // make sure jQuery is defined and up to date, then display ads
  if ($ && $.fn && versionChecker($.fn.jquery, '1.7.1')) {
    init();

  //else if no jquery at all, load it - use noConflict() to not affect site's $ object
  } else if(!$){
    loadScript(jQueryURL, function(){
      $ = window.jQuery.noConflict();
      init();
    });

  //else jquery must be out of date - use noConflict(true) to not affect site's $ or jQuery objects
  } else {
    loadScript(jQueryURL, function(){
      $ = window.jQuery.noConflict(true);
      init();
    });
  }

})(window, document, window.jQuery);