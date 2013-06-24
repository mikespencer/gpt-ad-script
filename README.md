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
`git remote add live ssh://spencerm@ads.wpprivate.com/data/git/wp-ad-loaders.git`

##TODO:

+  Seems to be caching issues when pushing live... Temporarily fixed for now by manually flushing each *.min.js url
+  Let's see if we can get uglifyjs updated to version 2 on the server so that we can utilise source maps. Optimizer requires uglifyjs2 in order to generate source maps. I think this would be very useful/important for our debugging.

##NOTES:

+  You can debug the page by using `?debugAdCode`, the bookmarklet, or just press `ctrl+F9`.
