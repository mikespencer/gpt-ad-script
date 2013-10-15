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

  module('t ad placement and kvs tests');

  test('t ad loaded', function(){
    ok(wpAd.adsOnPage.t, 't ok');
  });
  test('t ad slot created', function(){
    ok(wpAd.adsOnPage.t.slot, 't ad slot ok');
  });
  test('t ad sz kv', function(){
    deepEqual(wpAd.adsOnPage.t.config.size[0], [300, 50], 't kv sz ok');
  });
  test('t pos kv', function(){
    equal(wpAd.adsOnPage.t.keyvalues.pos[0], 't', 't kv pos ok');
  });

  module('gpt config and page level keyvalues tests');

  test('gpt config ok', function(){
    ok(wpAd.gptConfig, 'wpAd.gptConfig ok');
  });
  //test('page level keyvalue !c', function(){
  //  equal(wpAd.gptConfig.keyvalues['!c'][0], 'human_disaster', 'natural_disaster kv ok');
  //});
  //test('page level keyvalue pageId', function(){
  //  equal(wpAd.gptConfig.keyvalues.pageId[0], '1001_8_936429461', 'pageId kv ok');
  //});
  //test('page level keyvalue front', function(){
  //  equal(wpAd.gptConfig.keyvalues.front[0], 'n', 'front kv ok');
  //});
  //test('page level keyvalue page', function(){
  //  equal(wpAd.gptConfig.keyvalues.page[0], 'article', 'page kv ok');
  //});


}());
