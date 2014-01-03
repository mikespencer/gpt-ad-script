/**
 * Template of ad flights and available ad spots on washingtonpost.com (desktop)
 */
define(['jQuery', 'utils', 'wp/flags', 'wp/textlinks', 'wp/mediavoice'], function($, utils, flags, textlinks, mediavoice){

  var brandconnect = utils.wp_meta_data.contentName && /brand-?connect/i.test(utils.wp_meta_data.contentName[0]);
  //var articlePage = utils.wp_meta_data.contentType && /compoundstory/i.test(utils.wp_meta_data.contentType[0]);

  return {
    flights: {
      defaults: {
        what: [
          '120x240',
          '150x60',
          '200x50',
          '285x29',
          'bigbox',
          'bigbox_vi',
          'enterprise*',
          'flex',
          'flex_bb_hp',
          'flex_re',
          'flex_ss_bb',
          'flex_ss_bb_hp*',
          'flex_ss_tp',
          'grid_bigbox*',
          'inline_bb*',
          'inline_flex*',
          'inline_lb*',
          'interstitial*',
          'itb',
          'leaderboard',
          'leaderboard_2',
          'leaderboard_grid',
          'persistent_bb',
          'skyscraper'
        ]
      },

      //contains document.write's, fix in phase 2 if we even still need this
      /*topjobs: {
        what: ['topjobs'],
        hardcode: function(){
          return '<script type="text/javascript" src="http://js.washingtonpost.com/wp-adv/topjobs3/top_jobs_v3.js"></script>';
        }
      },*/

      homepage: {
        what: ['!leaderboard'],
        where: ['washingtonpost.com']
      },

      //22337-AL
      postlive_wonkblog_nyc: {
        what: ['!leaderboard'],
        where: ['postlive/conferences/wonkblog-nyc/front']
      },

      //Quigo Textlinks Begin:
      sponsor_links_in: {
        what: ['sponsor_links_in'],
        hardcode: function(){
          return textlinks.init(utils.wp_meta_data.contentType && utils.wp_meta_data.contentType[0], 'in', commercialNode);
        },
        test: function(){
          return !brandconnect;
        }
      },
      sponsored_links_rr: {
        what: ['sponsor_links_rr'],
        hardcode: function(){
          return textlinks.init(utils.wp_meta_data.contentType && utils.wp_meta_data.contentType[0], 'rr', commercialNode);
        },
        test: function(){
          return !brandconnect;
        }
      },
      sponsor_links_bt: {
        what: ['sponsor_links_bt'],
        hardcode: function(){
          return textlinks.init(utils.wp_meta_data.contentType && utils.wp_meta_data.contentType[0], 'bt', commercialNode);
        },
        test: function(){
          return !brandconnect;
        }
      },
      //Quigo Textlinks End

      //19879-CD
      no_bb_arkadium: {
        what: ['!bigbox', 'bigbox_2'],
        where: ['entertainment/arkadium']
      },
      local_page: {
        what: ['!leaderboard','!sponsor'],
        where: ['metro/front']
      },
      //10758-HS
      trulia_bb: {
        what: ['bigbox'],
        where: ['trulia']
      },
      re_front: {
        what: ['sponsor_community'],
        where: ['realestate/front']
      },
      //henry harding and tracy sislen
      spring2013DiningGuide: {
        what: ['leaderboard*'],
        where: ['goingoutguide/restaurants/spring2013guide']
      },
      //18183-AL-251594600
      featured_agent: {
        what : ['sponsor_agent'],
        where : ['realestate/front'],
        when : ['2013']
      },
      sponsor_spots_re: {
        what: ['sponsor_community','sponsor_condo','sponsor_new_home_builder'],
        where: ['realestate/neighborhoods/front', 'realestate/buy']
      },
      //20428-CD
      //22437-AL
      sponsor_spots_rentals:{
        what: ['featrent', 'featrent_2', 'featrent_3', 'featrent_4', 'featrent_5', 'featrent_6', 'featrent_7', 'featrent_8', 'featrent_9', 'featrent_10', 'featrent_11', 'featrent_12'],
        where: ['rentals']
      },
      jobs_336x60: {
        what: ['336x60'],
        where: ['jobs']
      },
      no_flex_mm: {
        what: ['!flex_ss_bb_hp'],
        where: ['multimedia/livevideo']
      },
      liveonlineflex: {
        what: ['!flex_ss_bb_hp'],
        where: ['multimedia/livevideo']
      },
      serviceAlley_homegarden: {
        what: ['serviceAlley'],
        where: ['lifestyle/home/front'],
        hardcode: function(){
          var a = document.createElement('a'),
              img = document.createElement('img'),
              container = document.getElementById('wpni_adi_serviceAlley') || document.getElementById('slug_serviceAlley');
          a.href = 'https://www.servicealley.com/';
          a.target = '_blank';
          img.src = 'http://img.wpdigital.net/wp-adv/advertisers/marketing/service-alley/Friendo-Decorator-334x255px.jpg';
          img.alt = 'Click here for more information about Service Alley.';

          if(container){container.style.paddingBottom = '10px';}

          a.appendChild(img);
          return a;
        }
      },
      //15630-ML
      serviceAlley: {
        what: ['marketing'],
        where: ['blogs/front','local/front','local/trafficandcommuting/front','local/dc-politics/front','local/md-politics/front','local/virginia_politics/front','business/local-business/front','lifestyle/home/front','metro/front','metro/traffic','metro/dc/front','metro/md/front','metro/va/front','metro/transportation','metro/local-tools','business/localbusiness/front','artsandliving/homeandgarden/front','realestate','realestate/neighborhoods/front','rentals'],
        hardcode: '<script type="text/javascript" src="http://www.servicealley.com/javascripts/wapo-widget.js"></script>'
      },
      gog_deal: {
        what: ['deal'],
        where: ['metro/front','cityguide'],
        hardcode: function(){
          var a = {"metro":"11","artsandliving/foodanddining":"12","cityguide":"13","cityguide/restaurants":"14","cityguide/bars":"15","cityguide/movies":"16","cityguide/events":"17","cityguide/music":"18","cityguide/museums":"19","cityguide/theater":"20","cityguide/bestbets":"21","cityguide/kidfriendly":"22","cityguide/visitors":"23"};
          return a[commercialNode] ? '<script type="text/javascript" src="http://files.secondstreetmedia.com/washingtonpost/widget'+a[commercialNode]+'.js"></script>' : '';
        }
      },
      local_food_336x60: {
        what: ['336x60'],
        where: ['lifestyle/food/front','local/front'],
        hardcode: function(){
          var a = {"local/front":"11","lifestyle/food/front":"12"};
          return a[commercialNode] ? '<script type="text/javascript" src="http://files.secondstreetmedia.com/washingtonpost/widget'+a[commercialNode]+'.js"></script>' : '';
        }
      },
      serviceAlley_test: {
        what: ['marketing'],
        where: ['blogs/front','local/front','local/trafficandcommuting/front','local/dc-politics/front','local/md-politics/front','local/virginia_politics/front','business/local-business/front','lifestyle/home/front','lifestyle/home_garden','metro/front','metro/traffic','metro/dc/front','metro/md/front','metro/va/front','metro/transportation','metro/local-tools','business/localbusiness/front','artsandliving/homeandgarden/front','realestate','realestate/neighborhoods/front','rentals'],
        hardcode: /http\:\/\/qaprev\./.test(location.href) ?
          (!window.jQuery ? '<sc' + 'ript type="text/javascript" src="http://js.washingtonpost.com/wpost/js/combo?token=20120507181000&c=true&m=true&context=eidos&r=/jquery-1.4.js"></sc' + 'ript>' : '' )+'<sc' + 'ript type="text/javascript" src="http://bunsen.wapolabs.com/revplat/prod/1.4.5-3/js/revplat.wp-config.js"></sc' + 'ript><sc' + 'ript type="text/javascript" src="http://bunsen.wapolabs.com/revplat/prod/1.4.5-3/js/revplat.min.js"></sc' + 'ript><div id="rev_ad_6"></div>' :
          '<sc'+'ript type="text/javascript" src="http://www.servicealley.com/javascripts/wapo-widget.js"></scr'+'ipt>'
      },
      serviceAlley_rev2: {
        what: ['marketing'],
        when: ['2013'],
        where: ['blogs/front','local/front','local/trafficandcommuting/front','local/dc-politics/front','local/md-politics/front','local/virginia_politics/front','business/local-business/front','lifestyle/home/front','lifestyle/home_garden','metro/front','metro/traffic','metro/dc/front','metro/md/front','metro/va/front','metro/transportation','metro/local-tools','business/localbusiness/front','artsandliving/homeandgarden/front','realestate','realestate/neighborhoods/front','rentals'],
        hardcode: function () {
          var digit = Math.floor(Math.random()*4+1);
          return "<a href='http://www.servicealley.com' target='_blank'><img src='http://img.wpdigital.net/wp-srv/ad/servicealley/ads/13-0526-" + digit + ".jpg' alt='Service Alley - Click Here for More!'></a>";
        }
      },
      ups_no_inline_bb: {
        what: ['!inline_bb'],
        where: ['liveonline/viewpoint/nevellj']
      },
      //18875-CD
      re300x100: {
        what: ['300x100', '336x60'],
        when: ['2013'],
        where: ['realestate']
      },
      //RICH P
      test_lep: {
        what: ['600x130'],
        where: ['jobs/front']
      },
      liveslostgallery: {
        what : ['!nav_tile', '!tiffany_tile', '!leaderboard', '!extra_bb', '!leaderboard_2', '!bigbox', '!promo'],
        test: function(){
          return utils.wp_meta_data.page_id && utils.wp_meta_data.page_id[0] === '1000.1.3877687284';
        }
      },
      //18182-AL-235419621
      lf336: {
        what: ['336x35_top'],
        where: ['realestate/front'],
        when: ['2013']
      },
      //20406-LB
      moneygrab: {
        what: ['extra_bb'],
        test: function(){
          return flags.pageType.article;
        }
      },
      //20552-CD
      car_dealer_showcase: {
        'what': ['dealer_showcase', 'dealer_showcase_2', 'dealer_showcase_3'],
        'where': ['cars/front']
      },
      //99999-JH
      custom_magazine_3: {
        what: ['marketing_2'],
        where: ['lifestyle/magazine/front'],
        when: ['2013'],
        hardcode: '<a href="http://www.washingtonpost.com/wp-adv/alm/2013/DCLegalLeaders.html" target="_blank"><img src="http://www.washingtonpost.com/wp-adv/legal/2013/2013LegalLeaders.jpg" width="300" height="250" border="0" alt="Check Out Our Video!" style="display:block"/></a><a href="http://www.washingtonpost.com/wp-adv/2013/privateschools" target="_blank"><img src="http://img.wpdigital.net/wp-adv/2013/privateschools/tiles/privateschoolstile3.300x250.3.jpg" width="300" height="250" border="0" alt="Click Here for More!" style="display:block;margin-top:10px;"/></a>'
      },
      //22261-SP
      cap_one_tile: {
        what: ['88x31'],
        when: ['2013']
      },
      //22337-AL
      postlive: {
        what: ['!88x31', '!leaderboard', '!flex_ss_bb_hp'],
        where: ['postlive']
      },
      //22337-AL
      postlive_edge: {
        what: ['flex_ss_bb_hp'],
        where: ['postlive/conferences/wonkblog-nyc/front']
      },
      //GOG-RESPONSIVE
      gog_responsive: {
        what: ['!flex_bb_hp'],
        where: ['cityguide/restaurants'],
        test: [function(){ return (document.documentElement.clientWidth < 1024) ? true : false; }]
      },
      //navtile for devprev
      target_dev_tile: {
        what: ['nav_tile'],
        hardcode: function () {
          var img = document.createElement('img');
          img.src = "//img.wpdigital.net/wp-srv/ad/img/target_tile_30x90.gif";
          img.width = 90;
          img.height = 29;
          img.alt = 'Target - Click Here for More!';
          return img;
        },
        test: [function () {return (/http\:\/\/qaprev\.|http\:\/\/devprev\./).test(location.href);}]
      },
      //more tiles
      tile_openings: {
        what: ['navtile_lifestyle', 'navtile_world', 'navtile_national'],
        when: ['2013']
      },
      //22611-CC
      ibmtiles: {
        'what': ['navtile_business'],
        'when': ['20131219/20131225']
      },
      //22235-JH
      trendex_sponsor_logo: {
        what: ['trendex_sponsor'],
        hardcode: function(){
          var sept = window.estNowWithYear && window.estNowWithYear.substr(0,6) <= '201309' ? true : false,
            ct = sept ? 'http://clk.atdmt.com/MRT/go/466172962/direct;at.PIX_WashPo_Trendex_Logo_1x1;wi.1;hi.1/01/' : 'http://clk.atdmt.com/MRT/go/467257629/direct;at.PIX_WashPost_Post_TV_Launch_Sponsor_Logo_1x1;wi.1;hi.1/01/',
            imp = sept ? 'http://view.atdmt.com/MRT/view/466172962/direct;at.PIX_WashPo_Trendex_Logo_1x1;wi.1;hi.1/01/' : 'http://view.atdmt.com/MRT/view/467257629/direct;at.PIX_WashPost_Post_TV_Launch_Sponsor_Logo_1x1;wi.1;hi.1/01/';

          return $('<div><span style="margin-bottom:10px;">Sponsored by</span>' +
            '<a href="' + ct + '" target="_blank">' +
              '<img src="http://img.wpdigital.net/wp-adv/advertisers/surface/2013/trendex_sponsor/Surface_Logo.png" alt="Click here for more information" style="border:0;outline:0;">' +
            '</a>' +
            '<img src="' + imp + '" style="display:none;">' +
            '</div>')[0];
        }
      },
      //22368-CD
      cfc_tile: {
        what: ['336x60'],
        when: ['201310170000/201312152359'],
        where: ['washingtonpost.com']
      },
      //22678-SP
      nasa_enterprise: {
        what: ['enterprise'],
        where: ['national/nasa/blog'],
        when: ['2013']
      },
      //22675
      //22710
      brandconnect_module_homepage: {
        what: ['brandconnect_module'],
        where: ['washingtonpost.com'],
        when: ['20131211', '20131212'],
        hardcode: function(){
          mediavoice.load();
          return false;
        }
      },
      //22683
      //extended per cd and clemenece
      brandconnect_module_bus: {
        what: ['brandconnect_module'],
        where: ['business/front'],
        when: ['20131210/20131224'],
        hardcode: function(){
          mediavoice.load();
          return false;
        }
      },
      brandconnect_module_test: {
        what: ['brandconnect_module'],
        test: [function(){
          return !!(/brandconnect/.test(window.location.search));
        }],
        hardcode: function(){
          mediavoice.load();
          return false;
        }
      },
      politics_chevron_social_surface: {
        what: ['theforum_336x60'],
        where: ['politics'],
        when: ['2013'],
        hardcode: function () {
          var rdm = Math.floor(Math.random() * 2),
            creative = document.createElement('img'),
            pix = document.createElement('img'),
            a = document.createElement('a'),
            tiles = [
              'http://img.wpdigital.net/wp-srv/ad/img/Chevron_336x60_V1.jpg',
              'http://img.wpdigital.net/wp-srv/ad/img/Chevron_336x60_V2.jpg'
            ],
            pixels = [
              'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=8081230&PluID=0&ord=%n&rtu=-1',
              'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=8582348&PluID=0&ord=%n&rtu=-1' //FOR V2
            ],
            hrefs = [
              'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=8081230&PluID=0&ord=%n',
              'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=8582348&PluID=0&ord=%n'
            ];
          creative.src = tiles[rdm];
          creative.alt = "Click Here for More!";

          pix.src = pixels[rdm];
          pix.style.display = 'none';

          a.href = hrefs[rdm];
          a.target = "_blank";

          a.appendChild(creative);
          a.appendChild(pix);

          return a;
        }
      },
      topicly_placeholder: {
        what: ['topicly_tile'],
        when: ['2014'],
        hardcode: function(){
          var img = document.createElement('img'),
              a = document.createElement('a'),
              creative = 'http://img.wpdigital.net/wp-srv/ad/img/topicly_tile.png',
              width = '90',
              height = '60',
              href = 'http://www.washingtonpost.com/wp-apps/topicly/';

          //remove ad label
          $('#wpni_adi_topicly_tile').removeClass('ads slug');

          //clickthrough
          a.href = href;
          a.target = '_blank';

          //creative
          img.src = creative;
          img.height = height;
          img.width = width;
          img.alt = 'Click here for more information';
          img.style.border = '0';
          img.style.display = 'inline-block';

          a.appendChild(img);

          return a;
        }
      },
      //22693-JH
      topicly_carousel_tile: {
        what: ['topicly_tile'],
        when: ['2013'],
        hardcode: function(){
          var rndm = Math.floor(Math.random() * 1E9),
            img = document.createElement('img'),
            a = document.createElement('a'),
            pix = document.createElement('img'),
            creative = 'http://img.wpdigital.net/wp-srv/ad/public/static/22693/topcily-sara.jpg',
            width = '90',
            height = '60',
            href = 'http://www.washingtonpost.com/wp-apps/topicly/',
            imp = false;

          if(/exxon_topicly_tile/.test(window.location.search)){
            creative = 'http://img.wpdigital.net/wp-srv/ad/public/static/22693/exxon-tile.png';
            href = 'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=8541856&PluID=0&ord=' + rndm;
            imp = 'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=8541856&PluID=0&ord=' + rndm + '&rtu=-1';
          }

          //remove ad label
          $('#wpni_adi_topicly_tile').removeClass('ads slug');

          //clickthrough
          a.href = href;
          a.target = '_blank';

          //creative
          img.src = creative;
          img.height = height;
          img.width = width;
          img.alt = 'Click here for more information';
          img.style.border = '0';
          img.style.display = 'inline-block';

          //impression tracking
          if(imp){
            pix.src = imp;
            pix.height = '1';
            pix.width = '1';
            pix.style.display = 'none';
            document.body.appendChild(pix);
          }

          a.appendChild(img);

          return a;
        }
      },
      //22391-JH
      business_wonkblog_tile: {
        what: ['marketing_2'],
        where: ['business'],
        when: ['20131209/20131215'],
        hardcode: function(){
          var div = document.createElement('div'),
            a = document.createElement('a'),
            i = document.createElement('img');

          i.src = 'http://img.wpdigital.net/wp-srv/ad/img/AI_IBM_201312_300x100_V2.png';
          i.alt = 'Click here for more information.';
          i.width = '300';
          i.height = '100';
          i.style.border = 'none';

          a.href = 'http://www.washingtonpost.com/sf/brand-connect/wp/2013/12/09/how-to-negotiate-cloud-contracts/?mvi=f7c8f2de105b4f3aa7ccfe8dc039bce3&mvt=in#!/';
          a.appendChild(i);

          div.appendChild(a);

          return div;
        }
      },
      theforum_88x31: {
        what: ['theforum_88x31'],
        hardcode: function(){
          var rndm = Math.floor(Math.random() * 1E5),
            creative = document.createElement('img'),
            pix = document.createElement('img'),
            a = document.createElement('a');

          creative.src = 'http://img.wpdigital.net/wp-srv/ad/public/static/theforum-chevron/88x31-alt.jpg';
          creative.alt = 'Click here for more information.';

          pix.src = 'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=8081231&PluID=0&ord=' + rndm + '&rtu=-1';
          pix.style.display = 'none';

          a.href = 'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=8081231&PluID=0&ord=' + rndm;
          a.target = '_blank';

          a.appendChild(creative);
          a.appendChild(pix);

          return a;
        }
      },
      //22752
      closeBottomLB: {
        what: ['!leaderboard_2'],
        where: [
          'politics/blog/the-fix',
          'politics/blog/post-politics',
          'local/blog/capital-weather-gang',
          'business/blog/ezra-klein',
          'blogs/classical-beat',
          'entertainment/music/blog/classical_beat'
        ]
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
      "brandconnect_module": { "size": [[1,1]] },
      "deal": { "size": [[1,1]], "keyvalues": { "ad": ["deal"], "pos": ["ad45"] } },
      "dealer_showcase": { "size": [[1,1]] },
      "enterprise": { "size": [[1,1]] },
      "extra_bb": { "size": [[300,250]], "keyvalues": { "ad": ["bb"], "pos": ["ad44"] } },
      "featrent": { "size": [[1,1]] },
      "featurebar": { "size": [[446,33]], "keyvalues": { "ad": ["fb"], "pos": ["ad7"] } },
      "flex": { "size": [[336,850],[336,280],[300,600],[300,1050]], "keyvalues": { "ad": ["hp"] } },
      "flex_bb_hp": { "size": [[336,850],[336,280],[300,600],[300,1050],[300,250]], "keyvalues": { "ad": ["hp","bb"], "pos": ["ad16"] } },
      "flex_re": { "size": [[300,600],[336,280],[300,250]], "keyvalues": { "ad": ["bb","tp"] } },
      "flex_ss_bb": { "size": [[160,600],[336,280],[300,250]], "keyvalues": { "ad": ["ss","bb"] } },
      "flex_ss_bb_hp": { "size": [[336,850],[336,280],[160,600],[300,250],[300,600],[300,1050]], "keyvalues": { "ad": ["ss","bb","hp"], "pos": ["ad6"] } },
      "flex_ss_tp": { "size": [[300,600],[336,280],[300,250]], "keyvalues": { "ad": ["bb","tp"] } },
      "grid_bigbox":  { "size": [[300,250]] },
      "inline_bb": { "size": [[300,250]], "keyvalues": { "ad": ["inline_bb"] } },
      "inline_flex": { "size": [[336,850],[160,600],[300,250],[300,600]], "keyvalues": { "ad": ["inline_bb"] } },
      "inline_lb": { "size": [[728,90]], "keyvalues": { "ad": ["inline_lb"] } },
      "interstitial": { "size": [['out of page']] },
      "itb": { "size": [[1,1]] },
      "leaderboard": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad1"] } },
      "leaderboard_2": { "size": [[728,90]], "keyvalues": { "ad": ["lb"], "pos": ["ad2"] } },
      "leaderboard_grid": { "size": [[728,90]] },
      "marketing": { "size": [[1,1]] },
      "mm_overlay": { "size": [[1,1]] },
      "nav_tile": { "size": [[1,1]] },
      "navtile": { "size": [[200, 60]]},
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
      "serviceAlley": { "size": [[1,1]] },
      "sponsor": { "size": [[1,1]] },
      "subscribe_promo": { "size": [[1,1]] },
      "sponsor_links_bt": { "size": [[1,1]] },
      "sponsor_links_in": { "size": [[1,1]] },
      "sponsor_links_rr": { "size": [[1,1]] },
      "tiffany_tile": { "size": [[200,60]], "keyvalues": { "ad": ["tiff"], "pos": ["ad14"] } },
      "theforum_88x31": { "size": [[88,31]] },
      "theforum_336x60": { "size": [[336,60]] },
      "tooltile": { "size": [[1,1]] },
      "topicly_tile": { "size": [[1,1]] },
      "topjobs": { "size": [[1,1]] },
      "trendex_sponsor": { "size": [[1,1]] }
    }
  };

});
