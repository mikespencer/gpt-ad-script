/**
 * Device, mobile/tablet Detection
 */
define(function(){

  var mobileKey,
    tabletKey,

    //width settings:
    mobileThreshold = 768,
    thisWidth = window.innerWidth || screen.width,
    isMobileWidth = thisWidth < mobileThreshold,

    //set default mobile/tablet flags to false:
    isMobile = false,
    isTablet = false,

    //mobile tests:
    mobile = {
      iOS: (/iphone|ipad|ipod/i).test(navigator.userAgent),
      Android: (/android/i).test(navigator.userAgent),
      BlackBerry: (/blackberry/i).test(navigator.userAgent),
      Windows: (/iemobile/i).test(navigator.userAgent),
      FirefoxOS: (/mozilla/i).test(navigator.userAgent) && (/mobile/i).test(navigator.userAgent)
    },

    //tablet tests:
    tablet = {
      iPad: (/ipad/i).test(navigator.userAgent)
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

});