(function() {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('generic required variables tests');

  test('commercialNode', function(){
    equal(commercialNode, 'business', 'commercialNode is correctly defined');
  });
  test('wpAd', function(){
    ok(wpAd, 'wpAd is defined');
  });
  test('placeAd2', function(){
    equal(typeof placeAd2, 'function', 'placeAd2 is defined');
  });

  module('async, leaderboard ad placement and kvs tests');

  asyncTest('wpAd.adsOnPage defined', 8, function(){
    setTimeout(function(){
      ok(wpAd.$, 'jquery ok');
      ok(wpAd.adsOnPage, 'wpAd.adsOnPage ok');
      ok(wpAd.adsOnPage.leaderboard, 'leadboard ok');
      ok(wpAd.adsOnPage.leaderboard.slot, 'leadboard ad slot ok');
      deepEqual(wpAd.adsOnPage.leaderboard.config.size[0], [728, 90], 'leadboard kv sz ok');
      equal(wpAd.adsOnPage.leaderboard.keyvalues.pos[0], 'ad1', 'leadboard kv pos ok');
      equal(wpAd.adsOnPage.leaderboard.keyvalues.pos[1], 'leaderboard', 'leadboard kv pos ok');
      equal(wpAd.adsOnPage.leaderboard.keyvalues.ad[0], 'lb', 'leadboard kv ad ok');
      start();
    }, 1000);
  });

  module('placeAd2 flex_ss_bb_hp', {
    setup: function(){
      placeAd2(commercialNode, 'flex_ss_bb_hp', false, '');
    }
  });

  asyncTest('flex_ss_bb_hp ok', 2, function(){
    setTimeout(function(){
      ok(wpAd.adsOnPage.flex_ss_bb_hp, 'flex_ss_bb_hp loaded');
      ok(wpAd.adsOnPage.flex_ss_bb_hp.slot, 'flex_ss_bb_hp ad slot ok');
      start();
    }, 1000);
  });


  module('gpt config and page level keyvalues tests');

  asyncTest('gpt config ok', 5, function(){
    setTimeout(function(){
      ok(wpAd.gptConfig, 'wpAd.gptConfig ok');
      equal(wpAd.gptConfig.keyvalues['!c'][0], 'human_disaster', 'natural_disaster kv ok');
      equal(wpAd.gptConfig.keyvalues.pageId[0], '1001_8_936429461', 'pageId kv ok');
      equal(wpAd.gptConfig.keyvalues.front[0], 'n', 'front kv ok');
      equal(wpAd.gptConfig.keyvalues.page[0], 'article', 'page kv ok');
      start();
    }, 1000);
  });

  module('Quigo sponsored links test');

  asyncTest('sponsor_links_rr hardcode defined', 2, function(){
    setTimeout(function(){
      ok(wpAd.adsOnPage.sponsor_links_rr.config.hardcode, 'sponsored_links_rr hardcode defined');
      ok(wpAd.$('#slug_sponsor_links_rr iframe[id*="adsonar"]').length, 'sponsor_links_rr iframe rendered');
      start();
    }, 1000);
  });


})();
