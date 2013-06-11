To run optimizer:

    node build/r.js -o build/slate.js
    node build/r.js -o build/wp.js
    node build/r.js -o build/mobile.js

To setup dependencies, use `make install`.

To build scripts, use `make build_js`.

To update GPT, use `make gpt`.

To update update loader.min.js, use `make build_loader`

Current live location of this repo for reference:
http://js.washingtonpost.com/wp-srv/ad/loaders/latest/

and to add live remote (change the "spencerm" part):
`git remote add live ssh://spencerm@ads.wpprivate.com/data/git/wp-ad-loaders.git`

##TODO:

+  Seems to be caching issues when pushing live...
+  Look in to getting rid of utils.merge(Ad.prototype.keyvaluesConfig, {ad:function(){...}, etc...}) out of each main.js file and moving it to it's own module (site/adLevelKeyvalues.js or better yet have one function that passes in config and keep it in keyvalues/config/adLevelKeyvalues.js or something...)

####DFP TEMPLATES THAT NEED TO BE MADE FRIENDLY IFRAME COMPATIBLE

+  WP - Slate Custom Cover 4.0
+  WP - Slate Custom Cover Video Only
+  WP - Wrapper
+  WP - Sidecar

##NOTES:

+  You can debug the page by using `?debugAdCode`, the bookmarklet, or just press `ctrl+f9`.
