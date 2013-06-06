To run optimizer:

    node build/r.js -o build/slate.js
    node build/r.js -o build/wp.js
    node build/r.js -o build/mobile.js

To setup dependencies, use `make install`.

To build scripts, use `make build_js`.

To update GPT, use `make gpt`.

Current live location of this repo for reference:
http://js.washingtonpost.com/wp-srv/ad/loaders/latest/

and to add live remote (change the "spencerm" part):
`git remote add live ssh://spencerm@ads.wpprivate.com/data/git/wp-ad-loaders.git`


TODO:
- Need to either update uglifyjs on server OR update command to work with v1 in Makefile.
- Seems to be caching issues when pushing live...