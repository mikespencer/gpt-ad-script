(function(w, d, n, define) {

    'use strict';

    if (typeof define === "function") {

        /**
         * Set of functions that return various pieces ofdevice info
         * @class sniff
         */
        define(function() {

            var iuaindex, auaindex, ual, ua = n.userAgent;

            var sniff = {

                isApple: function() {
                     return ua.match(/iPad|iPhone|iPod/g) ? true : false;
                },
                isAndroid: function() {
                    ual = ua.toLowerCase();
                    return ual.match(/android/g) ? true : false;
                },
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
                }
            };
            return sniff;
        });
    }


})(window, document, navigator, window.define);