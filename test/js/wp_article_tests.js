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
  test('jQuery', function(){
    ok(window.$ || wpAd.$, 'jQuery is defined');
  });
  test('wpAd', function(){
    ok(wpAd, 'wpAd is defined');
  });
  test('placeAd2', function(){
    equal(typeof placeAd2, 'function', 'placeAd2 is defined');
  });

  module('leaderboard ad placement and kvs tests');

  test('leaderboard ad loaded', function(){
    ok(wpAd.adsOnPage.leaderboard, 'leadboard ok');
  });
  test('leaderboard ad slot created', function(){
    ok(wpAd.adsOnPage.leaderboard.slot, 'leadboard ad slot ok');
  });
  test('leaderboard ad sz kv', function(){
    deepEqual(wpAd.adsOnPage.leaderboard.config.size[0], [728, 90], 'leadboard kv sz ok');
  });
  test('leaderboard pos kv', function(){
    equal(wpAd.adsOnPage.leaderboard.keyvalues.pos[0], 'ad1', 'leadboard kv pos ok');
    equal(wpAd.adsOnPage.leaderboard.keyvalues.pos[1], 'leaderboard', 'leadboard kv pos ok');
  });
  test('leaderboard ad kv', function(){
    equal(wpAd.adsOnPage.leaderboard.keyvalues.ad[0], 'lb', 'leadboard kv ad ok');
  });

  module('placeAd2 flex_ss_bb_hp', {
    setup: function(){
      placeAd2(commercialNode, 'flex_ss_bb_hp', false, '');
    }
  });

  test('flex_ss_bb_hp loaded', function(){
    ok(wpAd.adsOnPage.flex_ss_bb_hp, 'flex_ss_bb_hp loaded');
  });

  test('flex_ss_bb_hp ad slot created', function(){
    ok(wpAd.adsOnPage.flex_ss_bb_hp.slot, 'flex_ss_bb_hp ad slot ok');
  });

  module('gpt config and page level keyvalues tests');

  test('gpt config ok', function(){
    ok(wpAd.gptConfig, 'wpAd.gptConfig ok');
  });
  test('page level keyvalue !c', function(){
    equal(wpAd.gptConfig.keyvalues['!c'][0], 'human_disaster', 'natural_disaster kv ok');
  });
  test('page level keyvalue pageId', function(){
    equal(wpAd.gptConfig.keyvalues.pageId[0], '1001_8_936429461', 'pageId kv ok');
  });
  test('page level keyvalue front', function(){
    equal(wpAd.gptConfig.keyvalues.front[0], 'n', 'front kv ok');
  });
  test('page level keyvalue page', function(){
    equal(wpAd.gptConfig.keyvalues.page[0], 'article', 'page kv ok');
  });

  module('Quigo sponsored links test');

  test('sponsor_links_rr hardcode defined', function(){
    ok(wpAd.adsOnPage.sponsor_links_rr.config.hardcode, 'sponsored_links_rr hardcode defined');
  });
  test('sponsored_links_rr rendered', function(){
    ok(wpAd.$('#slug_sponsor_links_rr iframe[id*="adsonar"]').length, 'sponsor_links_rr iframe rendered');
  });


}());
