/**
 * this Initial setup
 */
(function(w, d, define){

  'use strict';

  define([
    'utils/extend',
    'utils/keyvalueIterator',
    'utils/addKeyvalues'
  ], function(extend, keyvalueIterator, addKeyvalues){

    return {

      init: function(config){
        this.config = extend({
          googletag: w.googletag
        }, config);

        this.googletag = this.config.googletag;
        this.pubservice = this.googletag.pubads();

        this.keyvalues = keyvalueIterator(this.keyvaluesConfig, this);
        addKeyvalues(this.keyvalues, this.pubservice);

        if(this.config.sra){
          this.pubservice.enableSingleRequest();
        } else {
          this.pubservice.enableAsyncRendering();
        }

        this.googletag.enableServices();

        return this;
      },

      keyvaluesConfig: {
        /*gets added in site script*/
      }

    };

  });

})(window, document, window.define);