/**
 * this Initial setup
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){

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

          kw: function(){
            var param = utils.urlCheck('test_ads', { type: 'variable' });
            return param ? ['test_' + param] : false;
          },

          poe: function(){
            var name = w.location.hostname + '_poe';
            if(utils.getCookie(name)){
              return ['no'];
            } else {
              utils.setCookie(name, 'true', '', '/', '','');
              return ['yes'];
            }
          }

        }

      };

    });
  }

})(window, document, window.define);