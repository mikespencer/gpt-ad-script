/**
 * AdOps requirements before page load
 */
var googletag = googletag || { cmd: [] },

  //store placeAd2 calls if 'real' placeAd2 isn't defined yet
  placeAd2Queue = [];

//placeholder until placeAd2 is defined
function placeAd2(){
  placeAd2Queue.push(arguments);
}