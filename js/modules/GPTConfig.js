/**
 * GPT Initial setup
 */
(function(w, d, define){

  'use strict';

  if(typeof define === 'function'){

    define('GPTConfig', ['utils.core'], function(utils){

      function GPTConfig(config){
        this.config = utils.extend({
          googletag: w.googletag
        }, config);

        this.googletag = this.config.googletag;
        this.pubservice = this.googletag.pubads();

        this.keyvalues = utils.keyvalueIterator(this.keyvaluesConfig, this);
        this.addKeyvalue(this.keyvalues);

        if(this.config.sra){
          this.pubservice.enableSingleRequest();
        } else {
          this.pubservice.enableAsyncRendering();
        }

        this.googletag.enableServices();
      }

      GPTConfig.prototype = {
        constructor: GPTConfig,

        addKeyvalue: function(){
          if(typeof arguments[0] === 'object'){
            var map = arguments[0], key;
            for(key in map){
              if(map.hasOwnProperty(key)){
                this.pubservice.setTargeting(key, (typeof map[key] === 'object' ? map[key] : [map[key]]));
              }
            }
          } else if(arguments.length === 2){
            this.pubservice.setTargeting(arguments[0], (typeof arguments[1] === 'object' ? arguments[1] : [arguments[1]]));
          }
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

      return GPTConfig;

    });
  }

})(window, document, window.define);