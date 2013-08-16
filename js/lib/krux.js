//fails jslint tests:
//window.Krux||((Krux=function(){Krux.q.push(arguments)}).q=[]);

var wpAd = wpAd || {};

if(!window.Krux){
  window.Krux=function(){
    Krux.q.push(arguments);
  };
  window.Krux.q=[];
}

(function(){

  /** CONTROL TAG BEGIN **/
  wpAd.krux = wpAd.krux || {};
  wpAd.krux_id = wpAd.krux_id || 'IbWIJ0xh';

  var k=document.createElement('script');
  k.type='text/javascript';
  k.async=true;
  var m,src=(m=location.href.match(/\bkxsrc=([^&]+)/))&&decodeURIComponent(m[1]);
  k.src = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :
    (location.protocol==="https:"?"https:":"http:")+"//cdn.krxd.net/controltag?confid=" + wpAd.krux_id;
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(k,s);

  /** CONTROL TAG END **/

  /** INTERCHANGE TAG BEGIN **/

  //21700
  function retrieve(n){
    var m, k='kx'+n;
    if (window.localStorage) {
      return window.localStorage[k] || "";
    } else if (navigator.cookieEnabled) {
      m = document.cookie.match(k+'=([^;]*)');
      return (m && unescape(m[1])) || "";
    } else {
      return '';
    }
  }

  Krux.user = retrieve('user');

  Krux.segments = retrieve('segs') ? retrieve('segs').split(',') : [];

  // DFP Premium
  var dfpp = [];
  if (Krux.user) {
    Krux.khost = encodeURIComponent(location.hostname);
    Krux.kuid = Krux.user;

    dfpp.push('khost=' + Krux.khost);
    dfpp.push('kuid=' + Krux.user);
  }
  for (var i = 0; i < Krux.segments.length; i++ ) {
    dfpp.push('ksg=' + Krux.segments[i]);
  }
  Krux.dfppKeyValues = dfpp.length ? dfpp.join(';') + ';' : '';


  /** INTERCHANGE TAG END **/

}());