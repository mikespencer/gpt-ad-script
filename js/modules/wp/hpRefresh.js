define(['utils'], function(utils){

  var refresh = {
    exec: function(){
      //homepage refresh modification:
      window.TWP = window.TWP || {};
      window.TWP.hpRefreshTests = window.TWP.hpRefreshTests || {};
      window.TWP.hpRefreshTests.adRefreshFunction = function() {
        return utils.flags.test_ads ? false : true;
      }
      return refresh;
    }
  };

  return refresh;
});