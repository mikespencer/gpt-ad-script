/**
 * AdOps requirements before page load
 */
var wpAd, googletag, placeAd2;

(function(root, d){
  'use strict';

  if(/no_ads/.test(location.search)){
    return false;
  }

  var adScript = d.createElement('script'),
      gptScript = d.createElement('script'),
      target = d.getElementsByTagName('head')[0] || d.body;

  function getSiteScript(){
    var siteScripts = {
      'wp': 'wp.js',
      'theroot': 'root.js',
      'slate': 'slate.js',
      'wp_mobile': 'mobile.js'
    },
    script = d.getElementById('adScript'),
    site = script && script.getAttribute('data-adops-site');
    return 'js/min/' + (site && siteScripts[site] ? siteScripts[site] : siteScripts.wp);
  }

  adScript.src = getSiteScript();
  adScript.async = true;

  gptScript.src = 'http://www.googletagservices.com/tag/js/gpt.js';
  gptScript.async = true;

  target.appendChild(adScript);
  target.appendChild(gptScript);

  root.placeAd2 = function(){
    placeAd2.queue = placeAd2.queue || [];
    placeAd2.queue.push(arguments);
  };

  root.googletag = root.googletag || { cmd: [] };

})(this, document);