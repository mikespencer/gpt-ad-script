define(['jQuery', 'viewable'], function($, vi){

  $.fn.viewable = vi;

  return {

    //defaults
    config: {
      pos: 'flex_ss_bb_hp',
      rrSelector: '#right-rail',
      contentSelector: '.main-content',
      count: 1,
      spacing: 1050,
      scrollInterval: 300,
      scrollOffset: 20,
      classes: '',
      css: {
        textAlign: 'center'
      }
    },

    init: function(config){
      config = config || {};
      this.configure(config);
      this.pos = this.config.pos + (this.config.count > 1 ? '_' + this.config.count : '');
      this.slug = '#slug_' + this.pos;
      if(this.shouldLoadAd()){
        console.debug('configured', this.pos, this.config);
        this.addContainer(this.slug);
        this.exec(this.slug);
      } else {
        $('div[id^="slug_' + this.config.pos + '"]:last', this.config.rrSelector).css({
          marginBottom: 0
        });
      }
    },

    configure: function(newConfig){
      this.config = $.extend(true, this.config, newConfig);
    },

    shouldLoadAd: function(){
      var $rr = $(this.config.rrSelector);
      var rrHeight = $rr.innerHeight();
      var contentHeight = $(this.config.contentSelector).innerHeight();

      console.debug($rr);
      console.debug('content height:', contentHeight);
      console.debug('rr height:', rrHeight);

      if(rrHeight + (this.config.spacing * 2) <= contentHeight){
        return true;
      }
      console.debug('FAILED CHECK:', rrHeight + (this.config.spacing * 2), '>', contentHeight);
      return false;
    },

    addContainer: function(slug){
      console.debug(slug);
      var $slug = $(slug);
      if(!$slug.length){
        $('<div></div>').attr({
          id: slug.replace('#', '')
        }).css(this.config.css).css({
          display: 'none',
          marginBottom: this.config.spacing + 'px'
        }).addClass(this.config.classes).appendTo(this.config.rrSelector);
      }
    },

    exec: function(element){
      var _this = this;
      $(element).css({
        width: 336,
        height: 850,
        display: 'block'
      }).viewable({
        offset: this.config.offset,
        interval: this.config.interval,
        callback: function(){
          _this.render(element);
        }
      });
    },

    render: function(element){
      console.debug('loading ad:', this.pos);
      $(element).css({
        width: '',
        height: ''
      });

      placeAd2({
        what: this.config.pos + (this.config.count > 1 ? '|' + this.config.count : '')
      });
      this.init({
        count: this.config.count + 1
      });
    }

  };
});
