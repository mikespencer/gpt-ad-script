define(['jQuery'], function($){

  return {

    //default config - can be overridden with this.configure()
    config: {
      container: '#article_body',
      selector: 'p',
      initialParagraphOffset: 0,
      minParagraphs: 6,
      initialCharOffset: 0,
      minChars: 2000,
      what: 'inline_bb',
      posOverride: 2,
      width: 300,
      height: 250,
      classes: ''
    },

    //for use in determining where to place inline ads (in this.exec)
    counter: {
      paragraphCount: 0,
      charCount: 0
    },

    //extends default config
    configure: function(newConfig){
      this.config = $.extend(true, this.config, newConfig);
    },

    //resets the counters
    reset: function(){
      this.counter.paragraphCount = 0;
      this.counter.charCount = 0;
    },

    //configure, reset counters, and then place the inline ads
    init: function(config){
      this.configure(config);
      this.reset();
      this.counter.paragraphCount -= this.config.initialParagraphOffset;
      this.counter.charCount -= this.config.initialCharOffset;
      this.exec();
    },

    //gets the full pos value with posOverride, with optional delimiter (defuaults to '_')
    getPosValue: function(delim){
      delim = delim || '_';
      return this.config.what + (this.config.posOverride > 1 ? delim + this.config.posOverride : '');
    },

    //finds where to place and places #slug_ div's, calls placeAd2 with vi arg.
    exec: function(){
      var _this = this;

      //get all eligible elements that do not contain an image
      $(_this.config.selector + ':visible:not(:empty):not(:has(img))', _this.config.container).not(':last').each(function(){
        var $this = $(this);
        var textLen = $this.text().length;

        //only increment paragraph counter if 'this' has text
        if(textLen){
          _this.counter.paragraphCount++;
          _this.counter.charCount = _this.counter.charCount + textLen;
        }

        //if enough paragraphs and characters have passed
        if(_this.counter.paragraphCount >= _this.config.minParagraphs && _this.counter.charCount >= _this.config.minChars){

          //creates and places the ad slug after the 'this'
          $this.after($('<div id="slug_' + _this.getPosValue('_') + '"></div>').css({
            width: _this.config.width + 'px',
            height: _this.config.height + 'px',
            display: 'block',
            float: 'left',
            margin: '5px 20px 20px 0'
          }).addClass(this.config.classes));

          placeAd2(commercialNode, _this.getPosValue('|'), 'vi', '');

          //increment for next ad placement
          _this.config.posOverride++;

          //reset paragraph and char counter
          _this.reset();

        }
      });
    }

  };

});
