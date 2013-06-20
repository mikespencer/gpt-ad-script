/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
 */
define(['utils'], function(utils) {

  /**
   * Object of checks for overrides
   */
  return {
    what: {
      tiffany_tile: function(){
        if (this.config.where === "washingtonpost.com") {
          this.config.size = [[184,90]];
        }
      }
    },
    pos: {
      //determines if page gets a full page interstitial
      interstitial: function(){
        if(utils.flags.showInterstitial && !utils.flags.front){
          this.addKeyvalues({
            ad: ['interstitial']
          });
        }
      },
      leaderboard: function() {
        if (this.config.where === 'washingtonpost.com') {
          this.config.where += '/lb';
          if(utils.flags.reload){
            this.config.where += 'refresh';
          }
        }
      },
      featrent: function() {
        var adi_div = document.getElementById('wpni_adi_featrent');
        if(adi_div){
          adi_div.style.background = 'none';
          adi_div.style.padding = '0';
        }
      },
      flex_bb_hp: function() {
        if(this.config.where === 'washingtonpost.com'){
          this.config.where += '/hpflex';
          if(utils.flags.reload){
            this.config.where += 'refresh';
          }
        } else if (this.config.where === 'lifestyle/home' ||
          this.config.where === 'lifestyle/home/front' ||
          this.config.where === 'lifestyle/home-garden') {
          this.config.where += '/flex';
        }
      },
      pushdown: function(){
        if(this.config.where === 'washingtonpost.com'){
          var adi_push = document.getElementById('wpni_adi_pushdown');
          if (adi_push) {
            adi_push.style.backgroundImage = 'url(http://img.wpdigital.net/wp-adv/test/mstest/pushdown-ad-small.png)';
            adi_push.style.backgroundPosition = '-7px -100px';
          }
        }
      }
    },
    where: {
      // May not need this section..
    }
  };

});