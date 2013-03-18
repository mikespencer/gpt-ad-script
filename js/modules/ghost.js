// ghost.js

//REQUIRES JQUERY

(function(w, d, $, define) {

    'use strict';

    if (typeof define === "function") {

        /**
         * Ghost loads after page loads and changes the PostMost widget to accommodate a sponsor.
         * Needs to be tweaked to accommodate sponsorship of other units.
         * "Surface" needs to be replaced with the new sponsor's creatives and name designation in Ghost.
         * @class ghost
         */

        define("ghost", ["surface"], function(surface) {
            var ghost = function() {

                var pixels = [surface.tile.p1, surface.tile.p2, surface.banner.p1, surface.banner.p2];

                //This is the mechanics for the app
                var postLoader = {
                    counter: 10,
                    exec: function(data) {
                        var spot = data.spot,
                            $target,
                            tile = data.tile,
                            banner = data.banner,
                            aTile = postLoader.generator(tile, tile.clickthrough),
                            aBanner = postLoader.generator(banner, banner.clickthrough);
                        if (spot === "postmost") {
                            //cache the jQuery object - faster
                            $target = $("div.most-post:first");
                            $(aTile).attr("id", "most-post-top-tile");
                            $(aBanner).attr("id", "most-post-bottom-banner");
                        }

                        //if element is not present, try again in a second (limit 10 times)
                        if (!$target.length && postLoader.counter) {
                            setTimeout(function() {
                                postLoader.counter--;
                                postLoader.exec(surface);
                            }, 1000);
                        }

                        //fix for headings that are too long included:
                        $target.find("p.heading.heading2:first").html('The Post Most').prepend(aTile);

                        $("#most-post-top-tile > img").css({
                            "margin-top": "-12px",
                            "float": "right"
                        });
                        $('div.most-post .tooltip').hide();
                        $target.append(aBanner);
                        $('#most-post-bottom-banner > img').css("margin", "2px 18px");
                    },
                    generator: function(vals, clickthrough) {
                        var img = new Image(vals.w, vals.h);
                        img.src = vals.url;
                        img.border = 0;
                        img.alt = "Click here for more information!";
                        return postLoader.linkify(img, clickthrough);
                    },
                    linkify: function(img, url) {
                        var a = d.createElement("a");
                        $(a).attr({
                            href: url,
                            target: "_blank"
                        });
                        var $a = $(a);
                        $a.html(img);
                        return $a;
                    },
                    addPixels: function(pixels) {
                        for (var i = 0; i < pixels.length; i++) {
                            var pix = new Image(1, 1);
                            pix.alt = "";
                            pix.src = pixels[i];
                            var $pix = $(pix);
                            $pix.css("display", "none");
                            $('body').append(pix);
                        }
                    }
                };

                //This executes the app.
                postLoader.exec(surface);
                postLoader.addPixels(pixels);
            };
            return ghost;
        });


    };


})(window, document, window.jquery, window.define);
