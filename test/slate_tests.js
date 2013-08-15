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

  module('Slate test module', {
    //setup: function() {
      // prepare something for all following tests
    //},
    //teardown: function() {
      // clean up after each test
    //}
  });

  test('commercialNode', 1, function(){
    equal(commercialNode, 'news', 'commercialNode is correctly defined');
  })
  test('jQuery', 1, function(){
    ok($, 'jQuery is defined');
  });

  test('wpAd', 1, function(){
    ok(window.wpAd, 'wpAd is defined');
  })

}(jQuery));