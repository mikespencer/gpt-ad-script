/**
 * Template of ad flights and available ad spots on washingtonpost.com (desktop)
 */
(function(w, d, define){

  'use strict';

  define(function(){

    return {
      flights: {
        defaults: {
          what: [
            'leaderboard',
            'leaderboard_2',
            'flex',
            'flex_re',
            'flex_bb_hp',
            'flex_ss_bb',
            'flex_ss_tp',
            'flex_ss_bb_hp',
            '120x240',
            '200x50',
            '150x60',
            '285x29',
            'bigbox*',
            'bigbox_vi',
            'inline_bb',
            'itb',
            'skyscraper',
            'grid_bigbox*',
            'persistent_bb'
          ]
        },
        homepage: {
          what: ['!leaderboard'],
          where: ['washingtonpost.com']
        },
        pd: {
          what:['pushdown'],
          when: ['201303180000/201303182359']
        }
      },

      adTypes: {
        "120x240": { "size": [[120,240]], "keyvalues": { "ad": ["120x240"] } },
        "300x100": { "size": [[300,100]] },
        "336x35": { "size": [[336,35]], "keyvalues": { "ad": ["336x35"], "pos": ["ad19"] } },
        "336x35_top": { "size": [[336,35]], "keyvalues": { "ad": ["336x35"] } },
        "336x60": { "size": [[336,60]], "keyvalues": { "ad": ["336x60"] } },
        "200x50": { "size": [[200,50]], "keyvalues": { "ad": ["200x50"] } },
        "150x60": { "size": [[150,60]], "keyvalues": { "ad": ["150x60"] } },
        "285x29": { "size": [[285,29]], "keyvalues": { "ad": ["285x29"] } },
        "600x130": { "size": [[600,130]] },
        "88x31": { "size": [[88,31]] },
        "agoogleaday": { "size": [[1,1]] },
        "bigbox": { "size": [[300,250]], "keyvalues": { "ad": ["bb"], "pos": ["ad20"] } },
        "deal": { "size": [[1,1]], "keyvalues": { "ad": ["deal"], "pos": ["ad45"] } },
        "dealer_showcase": { "size": [[1,1]] },
        "extra_bb": { "size": [[300,250]], "keyvalues": { "ad": ["bb"], "pos": ["ad44"] } },
        "featrent": { "size": [[1,1]] },
        "featurebar": { "size": [[446,33]], "keyvalues": { "ad": ["fb"], "pos": ["ad7"] } },
        "flex": { "size": [[336,850]], "keyvalues": { "ad": ["hp"] } },
        "flex_bb_hp": { "size": [[300,250],[300,600],[336,850]], "keyvalues": { "ad": ["hp","bb"], "pos": ["ad16"] } },
        "flex_re": { "size": [[300,250],[300,600]], "keyvalues": { "ad": ["bb","tp"] } },
        "flex_ss_bb": { "size": [[160,600],[300,250]], "keyvalues": { "ad": ["ss","bb"] } },
        "flex_ss_bb_hp": { "size": [[160,600],[300,250],[300,600],[336,850]], "keyvalues": { "ad": ["ss","bb","hp"], "pos": ["ad6"] } },
        "flex_ss_tp": { "size": [[300,250],[300,600]], "keyvalues": { "ad": ["bb","tp"] } },
        "grid_bigbox":  { "size": [[300,250]] },
        "inline_bb": { "size": [[300,250]], "keyvalues": { "ad": ["inline_bb"] } },
        "itb": { "size": [[1,1]] },
        "leaderboard": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad1"] } },
        "leaderboard_2": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad2"] } },
        "marketing": { "size": [[1,1]] },
        "mm_overlay": { "size": [[1,1]] },
        "nav_tile": { "size": [[1,1]] },
        "nn": { "size": [[200,80]] },
        "nn_footer": { "size": [[200,30]], "keyvalues": { "ad": ["nn_footer"] } },
        "nn_hp": { "size": [[190,20]], "keyvalues": { "ad": ["nn_hp"] } },
        "nn_rr": { "size": [[200,80]], "keyvalues": { "ad": ["nn_rr"] } },
        "nn_sidebar": { "size": [[200,30]], "keyvalues": { "ad": ["nn_sidebar"] } },
        "persistent_bb": { "size": [[300,250]] },
        "pptile": { "size": [[300,60]] },
        "promo": { "size": [[200,60]] },
        "pushdown": { "size": [[1,1]], "keyvalues": { "pos": ["ad43"] } },
        "skyscraper": { "size": [[160,600]], "keyvalues": { "ad": ["ss"], "pos": ["ad3"] } },
        "sponsor": { "size": [[1,1]] },
        "sponsor_links_bt": { "size": [[1,1]] },
        "sponsor_links_in": { "size": [[1,1]] },
        "sponsor_links_rr": { "size": [[1,1]] },
        "tiffany_tile": { "size": [[200,60]], "keyvalues": { "ad": ["tiff"], "pos": ["ad14"] } },
        "tooltile": { "size": [[1,1]] },
        "topjobs": { "size": [[1,1]] }
      }
    };

  });

})(window, document, window.define);