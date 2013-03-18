/**
 * this Initial setup
 */
(function(w, d, define){

  'use strict';

  define(['utils.core'], function(utils){

    return {

      init: function(config){
        this.config = utils.extend({
          googletag: w.googletag
        }, config);

        this.googletag = this.config.googletag;
        this.pubservice = this.googletag.pubads();

        this.keyvalues = utils.keyvalueIterator(this.keyvaluesConfig, this);
        utils.addKeyvalues(this.keyvalues, this.pubservice);

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