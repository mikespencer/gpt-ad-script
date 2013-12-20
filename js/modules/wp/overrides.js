/**
 * Overrides for standard configuration of ad spots for unique circumstances on washingtonpost.com (desktop)
 */
define(['utils', 'wp/flags', 'jQuery'], function(utils, flags, $) {

  /**
   * Object of checks for overrides
   */
  return {

    what: {

      tiffany_tile: function(){
        if (flags.pageType.homepage) {
          this.config.size = [[184,90]];
        }
        //important to disable carousel
        window.wpTiles = window.wpTiles || {};
        window.wpTiles.hasTiff = true;
      },

      flex_ss_bb_hp: function(){
        this.addKeyvalues({
          del: ['js']
        });
      },

      navtile: function(){
        this.config.where = 'wpnavtile';
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
        if (flags.pageType.homepage) {
          this.config.where += '/lb';
          if(utils.flags.reload){
            this.config.where += 'refresh';
          }
        }
        this.addKeyvalues({
          del: ['js']
        });
      },

      featrent: function() {
        $('#wpni_adi_featrent').css({
          background: 'none',
          padding: '0'
        });
      },

      flex_bb_hp: function() {
        if(flags.pageType.homepage){
          this.config.where += '/hpflex';
          if(utils.flags.reload){
            this.config.where += 'refresh';
          }
        } else if (this.config.where === 'lifestyle/home' ||
          this.config.where === 'lifestyle/home/front' ||
          this.config.where === 'lifestyle/home-garden') {
          this.config.where += '/flex';
        }
        this.addKeyvalues({
          del: ['js']
        });
      },

      pushdown: function(){
        if(flags.pageType.homepage){
          $('#wpni_adi_pushdown').css({
            backgroundImage: 'url(http://img.wpdigital.net/wp-adv/test/mstest/pushdown-ad-small.png)',
            backgroundPosition: '-7px -100px'
          });
          //eyeblaster specific fix for their expanded pushdown overlaying our expanded nav
          $(window).load(function(){
            if($('#slug_pushdown div[id^="ebDiv"]').length){
              $('#main-nav>li').not('.jobs, .posttv').hover(function(){
                $('#eyeDiv div[id^="eb"]').find('object, embed').each(function(){
                  $(this).parent().addClass('adnoDisplay');
                });
              }, function(){
                $('#eyeDiv div[id^="eb"]').find('object, embed').each(function(){
                  $(this).parent().removeClass('adnoDisplay');
                });
              });
            }
          });
        }
      },

      persistent_bb: function(){
        var appendTimer = setTimeout(function(){
          $('#wpni_adi_persistent_bb').append('<a href="//games.washingtonpost.com?wpmk=MK0000246" target="_blank" style="display:block;margin-top:5px;">' +
            '<img src="//img.wpdigital.net/wp-srv/ad/img/games_300x250.jpg" width="300" height="250" alt="WP Games - Click Here for More!" />' +
          '</a>');
        }, 500);
      }

    },

    where: {
      // May not need this section...
    }

  };

});
