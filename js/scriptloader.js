/**
 * Script loader for adops. Defines, loads and executes necessary ad dependencies based on site.
 */
var wpAd, placeAd2, googletag = googletag || { cmd: [] };

(function(w, d){
  'use strict';

  if(/no_ads/.test(location.search)){
    return false;
  }

  function getSiteScript(){
    var siteScripts = {
      'wp': 'wp.js',
      'theroot': 'root.js',
      'slate': 'slate.js',
      'wp_mobile': 'mobile.js'
    },
    script = d.getElementById('adscriptloader'),
    site = script && script.getAttribute('data-adops-site');
    return 'js/min/' + (site && siteScripts[site] ? siteScripts[site] : siteScripts.wp);
  }

  // Initially, use placeAd2 to store each ad spots data until all dependencies have been loaded and
  // placeAd2 is redefined to actually render each ad.
  w.placeAd2 = function(){
    placeAd2.queue = placeAd2.queue || [];
    placeAd2.queue.push(arguments);
  };

  function displayAds(){
    $('div[id^="slug_"][data-ad-type]').hide().each(function(){
      placeAd2(commercialNode, $(this).data('adType'), false, '');
    });
  }

  function loadScript(src, opt_callback) {
    var s = d.createElement('script'),
      target = d.body || d.getElementsByTagName('head')[0] || false;
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

  function init(){
    // get site specific ad script
    loadScript(getSiteScript());

    // get GPT services
    loadScript('http://www.googletagservices.com/tag/js/gpt.js');

    // make sure jQuery is defined, then display ads
    if(w.jQuery){
      displayAds();
    } else{
      loadScript('http://js.washingtonpost.com/wpost/js/combo/?token=20121010232000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js', displayAds);
    }
  }

  init();

})(window, document);