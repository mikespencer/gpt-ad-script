/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
 */
define(['utils/reload', 'utils/merge'], function(reload, merge) {

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
      leaderboard: function() {
        if (this.config.where === 'washingtonpost.com') {
          this.config.where += '/lb';
          if(reload){
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
          if(reload){
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