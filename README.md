#Development

To run optimizer:

    node build/r.js -o build/slate.js
    node build/r.js -o build/wp.js
    node build/r.js -o build/theroot.js
    node build/r.js -o build/wp_mobile.js

To setup dependencies, use `make install`.

To build scripts, use `make build_js`.

To watch scripts and build on change/save, use `make watch`.

To update GPT, use `make gpt`.

To update update loader.min.js, use `make build_loader`

Current live location of this repo for reference:
http://js.washingtonpost.com/wp-srv/ad/loaders/latest/

and to add live remote (change the "spencerm" part):
`git remote add live ssh://spencerm@ads.wpprivate.com/data/git/wp-ad-loaders.git


#Development with Grunt.js

To install dependencies, use `npm install && bower install`.

To build all necessary files, use `grunt build`.

To update GPT, use `grunt build_gpt`.

To build JavaScript (includes jshint tests), use `grunt build_js`.

To build CSS, use `grunt build_css`.

To watch for changes, use `grunt watch`.

To start a server at http://localhost:5000 and watch for changes with livereload enabled, use `grunt server`.

To run Qunit tests, use `grunt test`.

Using `grunt`, will do all of the above.

For more information and a list of commands, use `grunt -h`.

For more information on Grunt.js [click here](http://gruntjs.com/)


#Implementation


##Traditional Implementation (inline placeAd2)



###Ad Script

Simply replace the following existing ad scripts in the `<head></head>` of the page, below where commercialNode is defined:

    <script src="http://js.washingtonpost.com/wp-srv/ad/generic_ad.js">
    <script src="http://js.washingtonpost.com/wp-srv/ad/(wp/slate/root).js">

With:

    <script src="http://js.washingtonpost.com/wp-srv/ad/loaders/latest/js/min/loader.min.js" data-ad-site="[SITE]"></script>

Where `[SITE]` can be either `wp`, `slate`, `theroot`, `slate_mobile` or `wp_mobile`.

If the page is a **responsive** page (needs potential for desktop and mobile ad calls), add the attribute `data-ad-page-type="responsive"` to the above script tag and use the desktop version of the script for `[SITE]`. **Do not add an async attribute to this script tag**. A placeAd2 placeholder function needs to be defined immediately to prevent errors using this method. All other scripts are loaded asynchronously from this script.



###Ad Spot Coding:

Each placeAd2 call can remain unchanged on the page for backwards compatibility:

    <script>
      placeAd2(commercialNode, [pos value]:String, [delivery type]:String|false, [on the fly keyvalues]:String);
    </script>


Although, the new implementation of placeAd2 is preferred:

    <script>
      placeAd2({
        where: commercialNode (OPTIONAL),
        what: [pos value]:String,
        delivery: [delivery type]:String (OPTIONAL - use "vi" for ads to be rendered on view),
        onTheFly: [on the fly keyvalues]:String (OPTIONAL)
      });
    </script>


##Preferred Implementation (full asyc, data attributes)



###Ad Script

Completely **remove** old ad scripts:

    <script src="http://js.washingtonpost.com/wp-srv/ad/generic_ad.js">
    <script src="http://js.washingtonpost.com/wp-srv/ad/(wp/slate/root).js">

Place the following script at/towards the bottom of the page:

    <script src="http://js.washingtonpost.com/wp-srv/ad/loaders/latest/js/min/loader.min.js" data-ad-site="[SITE]" async></script>

Where `[SITE]` can be either `wp`, `slate`, `theroot`, `slate_mobile` or `wp_mobile`.

If the page is a **responsive** page (needs potential for desktop and mobile ad calls), add the attribute `data-ad-page-type="responsive"` to the above script tag and use the desktop version of the script for `[SITE]`.



###Ad Spot Coding

Inline placeAd2 calls are no longer needed using this method (but, placeAd2 can be called **after** the above ad script has loaded if needed for ad spot refreshes, etc).

Most basic ad spot syntax, placed in the position the ad is supposed to render, before the ad script is loaded:

    <div id="slug_[POS]" data-ad-type="[POS]"></div>

Where `[POS]` should be the pos value of the ad (leaderboard, bigbox, pushdown, etc.).

####Additional ad spots of the same type on a given page

    <div id="slug_[POS]_2" data-ad-type="[POS]|2"></div>
    <div id="slug_[POS]_3" data-ad-type="[POS]|3"></div>
    <div id="slug_[POS]_4" data-ad-type="[POS]|4"></div>

Etc...


####Additional attributes

The following attributes can be added to the `#slug_[POS]` element (ad spot) to further customise the ad call if needed (just like the arguments in placeAd2):

commercialNode override example:

    data-ad-where="politics"

On the fly keyvalues example:

    data-ad-on-the-fly="newKeyvalue=1"

This example will deliver the ad as a "viewable impression" (only once it is in view).

    data-ad-delivery="vi"



##TODO:

+  Seems to be caching issues when pushing live... Temporarily fixed for now by manually flushing each *.min.js url
+  Let's see if we can get uglifyjs updated to version 2 on the server so that we can utilise source maps. Optimizer requires uglifyjs2 in order to generate source maps. I think this would be very useful/important for our debugging.

+  **FOR WP LAUNCH**
    +  subscribe promos
    +  county sponsor stuff
    +  hackbin --> overrides
    +  brand connect tracking


##NOTES:

+  You can debug the page by using `?debugAdCode`, the bookmarklet, or just press `ctrl+F9`. `ctrl+F9` will only work in a particular browser on a domain once you have used one of the other two methods to debug the page. This is to try to prevent users "accidently" pressing ctrl+f9 and getting our debug boxes.
