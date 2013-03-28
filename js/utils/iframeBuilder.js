(function(){

  'use strict';

  define(function(){

    /**
     * Builds and returns a DOM iframe element.
     * @param {Object} atts Attribute mapping for the iframe that will overwrite defaults.
     * @return {Element} The constructed iframe DOM element.
     */
    return function (atts) {
      var i = document.createElement('iframe'),
        key;

      atts = atts || {};

      //default attributes
      i.frameBorder = "0";
      i.height = "0";
      i.width = "0";
      i.scrolling = "no";
      i.marginHeight = "0";
      i.marginWidth = "0";

      for(key in atts) {
        if(atts.hasOwnProperty(key)) {
          i[key] = atts[key];
        }
      }

      return i;
    };

  });

})();