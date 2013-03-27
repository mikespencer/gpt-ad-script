(function(win, doc, define) {

    'use strict';

    define(function() {
        var amazon = {
            exec: function() {
                var args = doc.amzn_args || win.amzn_args || false;
                if (args) {
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            keyvalues[key] = args[key];
                        }
                    }
                }
            }
        }
        return amazon;
    });
})(window, document, window.define);
