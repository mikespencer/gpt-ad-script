(function(w, d, n, define) {

    'use strict';

    if (typeof define === "function") {

        /**
         * Set of functions that return various pieces of device info
         * @class sniff
         */
        define(function() {

            var iuaindex, auaindex, ual, ua = n.userAgent;

            var sniff = {
                isApple: ua.match(/iPad|iPhone|iPod/g) ? true : false,
                isAndroid: ua.toLowerCase().match(/android/g) ? true : false,
                iDeviceType: function() {
                    if (ua.match(/iPad/g)) {
                        return "iPad";
                    } else if (ua.match(/iPhone/g)){
                        return "iPhone";
                    } else if (ua.match(/iPod/g)){
                        return "iPod";
                    } else {
                        return false;
                    }
                },
                flashVersion: function() {
                    var i, a, o, p, s = "Shockwave",
                        f = "Flash",
                        t = " 2.0",
                        u = s + " " + f,
                        v = s + f + ".",
                        rSW = new RegExp("^" + u + " (\\d+)");
                    if ((o = n.plugins) && (p = o[u] || o[u + t]) && (a = p.description.match(rSW))) return Number(a[1]);
                    else if ( !! (w.ActiveXObject)) for (i = 10; i > 0; i--) try {
                        if ( !! (new ActiveXObject(v + v + i))) return Number(i);
                    } catch (e) {}
                    return 0;
                },
                hasFlash: function() {
                    return !!sniff.flashVersion();
                },
                hasOSVersion: function() {
                    auaindex = ua.indexOf( 'Android ' );
                    iuaindex = ua.indexOf( 'OS ' );
                    if (sniff.isApple()  &&  iuaindex > -1 ) {
                        return Number(ua.substr( iuaindex + 3, 3 ).replace( '_', '.' ));
                    } else if (this.sniff.isAndroid() && auaindex > -1 ){
                        return Number(ua.substr( auaindex + 8, 3 ));
                    } else {
                        return false;
                    }
                },
                deviceDisplay: {
                    height: screen.height,
                    width: screen.width,
                    isRetina: !!(window.devicePixelRatio > 1)
                }
            };
            return sniff;
        });
    }


})(window, document, navigator, window.define);