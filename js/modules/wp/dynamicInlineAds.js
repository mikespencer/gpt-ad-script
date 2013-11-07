define(['jQuery', 'viewable'], function($, vi){

  $.fn.viewable = vi;


  return {

    config: {
      minChars: 1000,
      minParagraphs: 6,
      container: '.main-content',
      pos: 'inline_bb',
      count: 1,
      lastTargetElementIndex: 0
    },

    init: function(setup){
      console.debug('Initialising:', setup);
      setup = setup || {};
      this.configure(setup);
      console.debug('Config:', this.config);
      this.target = this.getTarget();
      console.debug('Target:', this.target);
      this.addSlug(this.target);
      console.debug(this);
      this.exec('#slug_' + this.config.pos + (this.config.count > 1 ? '_' + this.config.count : ''));
    },

    configure: function(newConfig){
      this.config = $.extend(true, this.config, newConfig);
    },

    getTarget: function(){
      var chars = 0;
      var paragraphs = 0;
      var _this = this;
      var target = null;

      $('p:gt(' + this.config.lastTargetElementIndex + ')', this.config.container).each(function(i, el){
        var charLen = $(this).text().length;
        console.debug(chars, el);
        chars += charLen;
        if(charLen){
          paragraphs += 1;
        }
        if(paragraphs >= _this.config.minParagraphs && chars >= _this.config.minChars){
          target = el;
          console.debug('found target', target);
          _this.config.lastTargetElementIndex += i;
          console.debug('index', i);
          return false;
        }
      });

      console.debug('TARGET:', target);
      return target;
    },

    addSlug: function(target){
      var posOverride = this.config.count > 1 ? '_' + this.config.count : '';
      var pos = this.config.pos + posOverride;
      $(target).after($('<div></div>').attr({
        id: 'slug_' + pos
      }));
      console.debug('added slug for', pos);
    },

    exec: function(element){
      var _this = this;
      console.debug('exec', element);
      $(element).css({
        width: 300,
        height: 250,
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
      console.debug('render', element);
      $(element).css({
        width: '',
        height: ''
      });

      console.debug('loading ad:', this.pos);
      placeAd2({
        what: this.config.pos + (this.config.count > 1 ? '|' + this.config.count : '')
      });
      this.init({
        count: this.config.count + 1
      });
    }

  };

});