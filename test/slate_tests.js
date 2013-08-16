(function($) {
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
    equal(commercialNode, 'news', 'commercialNode is correctly defined');
  });
  test('jQuery', function(){
    ok($, 'jQuery is defined');
  });
  test('wpAd', function(){
    ok(wpAd, 'wpAd is defined');
  });
  test('placeAd2', function(){
    equal(typeof placeAd2, 'function', 'placeAd2 is defined');
  });

  module('leaderboard ad placement and kvs tests')

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
    equal(wpAd.adsOnPage.leaderboard.keyvalues.pos[0], 'leaderboard', 'leadboard kv pos ok');
  });
  test('leaderboard ad kv', function(){
    equal(wpAd.adsOnPage.leaderboard.keyvalues.ad[0], 'lb', 'leadboard kv ad ok');
  });

  module('gpt config and page level keyvalues tests');

  test('gpt config ok', function(){
    ok(wpAd.gptConfig, 'wpAd.gptConfig ok');
  });
  test('page level keyvalue !c', 2, function(){
    equal(wpAd.gptConfig.keyvalues['!c'][0], 'natural_disaster', 'natural_disaster kv ok');
    equal(wpAd.gptConfig.keyvalues['!c'][1], 'human_disaster', 'human_disaster kv ok');
  });
  test('page level keyvalue pageId', function(){
    equal(wpAd.gptConfig.keyvalues.pageId[0], 'thisIsThePageId', 'pageId kv ok');
  });
  test('page level keyvalue front', function(){
    equal(wpAd.gptConfig.keyvalues.front[0], 'n', 'front kv ok');
  });
  test('page level keyvalue page', function(){
    equal(wpAd.gptConfig.keyvalues.page[0], 'article', 'page kv ok');
  });

}(jQuery));