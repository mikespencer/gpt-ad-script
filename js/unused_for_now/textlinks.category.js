(function(w, d) {

    'use strict';

    if (typeof define === "function") {

        /*
         * @class category
         */
        define('category', function() {
            var category = [{
                'washingtonpost.com': ['washingtonpost.com'],
                'artsandliving': ['artsandliving', 'artsandlivingarticle', 'artsandleisure', 'artsandleisurearticle', 'dating', 'entertain', 'entertainarticle', 'entertainbestbets', 'entertainment', 'entertainmentarticle', 'food', 'foodarticle', 'market', 'pets', 'photo', 'photoarticle', 'shoplocal', 'shopping', 'shoppingNEW', 'shoppingUSED', 'style', 'stylearticle', 'tastepost', 'travel', 'traveldirectory', 'travel.sidestep', 'travelarticle', 'lifestyle', 'entertainment'],
                'news': ['nation', 'nationarticle', 'news', 'world', 'worldarticle', 'religion', 'realestate', 'digest', 'digestarticle', 'fairfaxextra', 'liveonline', 'liveonlinearticle', 'localportal', 'metro', 'metroarticle', 'mostemailed', 'mostviewedarticles', 'opinion', 'opinionarticle', 'national'],
                'business': ['business', 'allbusiness', 'businessarticle'],
                'education': ['education'],
                'health': ['health'],
                'politics': ['politics', 'supertuesday', 'wiki'],
                'technology': ['technology'],
                'sports': ['sports', 'sportsarticle'],
                'local': ['local']
            }, {
                'education': ['local/education', 'national/higher-education'],
                'health': ['politics/health_care', 'national/health'],
                'technology': ['business/technology']
            }];
            return category;
        });

    };


})(window, document);
