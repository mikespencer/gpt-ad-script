/**
 * Script loader for adops. Defines, loads and executes necessary ad dependencies based on site.
 */
var wpAd, placeAd2, googletag = googletag || { cmd: [] };

(function(w, d){
  'use strict';

  if(/no_ads/.test(location.search)){
    return false;
  }

  var $ = w.jQuery || w.$ || undefined,
      baseURL = 'js/min/';

  function getSiteScript(){
    var siteScripts = {
      'wp': 'wp.js',
      'theroot': 'root.js',
      'slate': 'slate.js',
      'wp_mobile': 'mobile.js'
    },
    script = d.getElementById('adscriptloader'),
    site = script && script.getAttribute('data-adops-site');
    return site && siteScripts[site] ? siteScripts[site] : siteScripts.wp;
  }

  function displayAds($){
    if(!$ && w.console){
      try{console.log('jQuery undefined');}catch(e){}
    }
    $('div[id^="slug_"][data-ad-type]').hide().each(function(){
      var $this = $(this),
          where = $this.data('adWhere') || commercialNode,
          what = $this.data('adType'),
          del = $this.data('adDelivery') || false,
          otf = $this.data('adOnTheFly') || '';
      placeAd2(where, what, del, otf);
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

  // Initially, use placeAd2 to store each ad spots data until all dependencies have been loaded and
  // placeAd2 is redefined to actually render each ad.
  w.placeAd2 = function(){
    placeAd2.queue = placeAd2.queue || [];
    placeAd2.queue.push(arguments);
  };

  // get site specific ad script
  loadScript(baseURL + getSiteScript());

  // get GPT services
  loadScript('http://www.googletagservices.com/tag/js/gpt.js');

  // make sure jQuery is defined, then display ads
  if($){
    displayAds($);
  } else{
    loadScript('http://js.washingtonpost.com/wpost/js/combo/?token=201210102320000&c=true&m=true&context=eidos&r=/jquery-1.7.1.js', function(){
      displayAds(w.jQuery);
    });
  }

})(window, document);
