/**
 * Script loader for adops. Defines, loads and executes necessary ad dependencies based on site.
 */
var placeAd2, wpAd = wpAd || {}, googletag = googletag || { cmd: [] };

(function($){

  'use strict';

  if(/no_ads/.test(location.search)){
    return false;
  }

  // Borrowed from HTML5BP: https://github.com/h5bp/html5-boilerplate/blob/master/js/plugins.js
  // Avoid `console` errors in browsers that lack a console.
  window.console = (function() {
    var method;
    var noop = function () {};
    var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
        console[method] = noop;
      }
    }
    return console;
  }());

  //Test for referencing local versions of files for testing
  var localhost = /localhost/.test(document.domain),

    //debugging flag
    debug = !!(/debugadcode/i.test(location.search)),

    //base url for site scripts
    baseURL = localhost ? 'js/min/' : 'http://js.washingtonpost.com/wp-srv/ad/loaders/latest/js/min/',

    //URL for jQuery to load if not already defined on the page
    jQueryURL = 'http://js.washingtonpost.com/wpost/js/combo/?token=201210102320000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js',

    //Config loading of site specific CSS or not.
    //I'm currently doing this to prevent needlessly loading empty files
    loadCSS = {
      wp: true,
      theroot: false,
      slate: false,
      wp_mobile: false,
      slate_mobile: false
    },

    //device detection
    device = (function(ua){

      var mobileKey,
        tabletKey,

        //width settings:
        mobileThreshold = 768,
        thisWidth = window.innerWidth || window.screen && window.screen.width,
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
   * Custom function with special attributes for loading Krux's script
   * @param {String} id Krux id (site specific). Defaults to wp.
   */
  function loadKrux(id){
    //default fallback value (wp)
    wpAd.krux_id = id || 'IbWIJ0xh';

    if(!window.Krux){
      window.Krux=function(){
        window.Krux.q.push(arguments);
      };
      window.Krux.q=[];
    }

    var krux_script = document.createElement('script'),
      target = document.getElementsByTagName('head')[0] || document.body;
    krux_script.src = (!localhost ?
                       'http://js.washingtonpost.com/wp-srv/ad/loaders/latest/' : '') + 'js/lib/krux.js';

    krux_script.type = 'text/javascript';
    //krux_script.async = true;
    krux_script.className = 'kxct';
    krux_script.setAttribute('data-id', wpAd.krux_id);
    krux_script.setAttribute('data-timing', 'async');
    krux_script.setAttribute('data-version', '1.9');

    if(target && !/file/.test(location.protocol)){
    //THIS BREAKS QUNIT TESTS.. NEED TO FIGURE OUT WHY
    //if(target){
      target.appendChild(krux_script);
    }
  }

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
        'wp_mobile': 'wp_mobile.min.js',
        'slate_mobile': 'slate_mobile.min.js'
      },
      $target = $('script[data-ad-site]:first'),
      responsive = $target.data('adPageType') === 'responsive',
      site = $target.data('adSite'),
      script = siteScripts[site];

    //set some default fallbacks
    if(!siteScripts[site]){
      console.log('--ADOPS DEBUG-- Could not find attribute "data-ad-site" or a corresponding value. Defaulting to wp.min.js.');
      site = 'wp';
      script = siteScripts.wp;
    }

    //if responsive page and mobile device, update script reference to mobile version
    if(responsive && device.isMobile && device.isMobileWidth){
      site += /_mobile$/.test(site) ? '' : '_mobile';
      if(debug){
        console.log('--ADOPS DEBUG-- Resposive page detected. Attempting to use script:', script);
      }
    }

    if(debug){
      console.log('--ADOPS DEBUG-- Loading site script:', script);
    }

    //return siteScripts.wp;
    return {
      script: script,
      site: site
    };
  }

  /**
   * Gets all ad containers on the page, loops through them, and calls placeAd2 for each based on
   * data attributes.
   */
  function displayAds(){
    $('*[id^="slug_"][data-ad-type]').hide().each(function(){
      var $this = $(this);
      placeAd2({
        where: $this.data('adWhere') || window.commercialNode,
        what: $this.data('adType'),
        delivery: $this.data('adDelivery'),
        onTheFly: $this.data('adOnTheFly')
      });
    });
  }

  /**
   * Load site specific CSS
   * @param {String} site Name of site. Should match name of CSS file
   */
  function loadSiteCSS(site){
    if(site && loadCSS[site]){
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

    //expose site info
    wpAd.siteInfo = siteInfo;

    //store our version of jQuery
    wpAd.$ = $;

    //mobile commercialNode fix
    if(!window.commercialNode && wpAd.siteInfo.site === 'wp_mobile'){
      window.commercialNode = $('.page').attr('data-adkey') || '';
      window.commercialNode = window.commercialNode.replace(/^mob\.wp\./, '');
    }

    //LOAD KRUX ASAP
    if((siteInfo.site === 'wp' || siteInfo.site === 'wp_mobile') && !/kidspost/i.test(commercialNode)){
      loadKrux('IbWIJ0xh');
    } else if(siteInfo.site === 'slate' || siteInfo.site === 'slate_mobile'){
      loadKrux('IemEj7lF');
    }

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
        console.log('--ADOPS DEBUG-- AdOps site script failed to load:', err);
      },
      success: function(){
        if(debug){
          console.log('--ADOPS DEBUG--', scriptURL, 'loaded');
        }

        displayAds();
      }
    });

  }

  /**
   * Helper function to load scripts. Used here to load jQuery if it is not present on the page.
   * @param {String|Object} src URL of script to load. Optionally pass in as Object to override type.
   * @param {Function} opt_callback Optional callback function once the script has loaded.
   */
  function loadScript(src, opt_callback) {
    var s = document.createElement('script');
    var target = document.body || document.getElementsByTagName('head')[0] || false;
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
      if(typeof thisVer[i] !== 'undefined'){

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

})(window.jQuery);