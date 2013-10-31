/**
 * Determines whether a user is subscribed (true) or not subscribed (false)
 */
define(function(){
  return function(){
    var TWP = window.TWP || {};
    var pwresp = TWP.Identity && TWP.Identity.paywall && TWP.Identity.paywall.pwresp || {};
    return pwresp.mtfn === 1 && pwresp.sub === 1;
  };
});
