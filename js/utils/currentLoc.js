(function(n, define) {

    'use strict';

    define(function() {

        /**
         * Returns the current GPS location
         * of the user. Works on mobile and desktop.
         * @return {object} lat, long, accuracy.
         */
        return (function() {
            n.geolocation.getCurrentPosition(GetLocation);

            function GetLocation(location) {
                var loc = {
                    "latitude": location.coords.latitude,
                    "longitude": location.coords.longitude,
                    "accuracy": location.coords.accuracy
                };
                return loc;
            }
        })();

    });

})(navigator, window.define);
