/**
 * Checks and builds an ad template of open spots on the current page
 */

 /*
  NONE OF THIS WORKS YET...
 */
(function(w, d, define, commercialNode){

  'use strict';

  if(typeof define === 'function'){
    define('templateBuilder', ['estNowWithYear', 'utils.core'], function(estNowWithYear, utils){

      /**
       * Checks and returns an object of open spots and relevant properties (hardcodes, etc).
       */
      function TemplateBuilder(config){
        this.flights = config;
        //this.template = this.exec();

        //if(!wpAd.flags.demoAds) {
          this.template = {};
          /*if(wpAd.config.tiffanyTiles){
            wpAd.tools.extendTemplates(wpAd.config.tiffanyTiles);
          }*/
          for(var key in this.flights) {
            if(this.flights.hasOwnProperty(key)){
              //key needs to be pos in templtae..
              this.loopThroughTemplate(key, this.flights[key]);
            }
          }
        //} else {
        //  wpAd.templates = wpAd.tools.demoAds();
        //}

      }

      TemplateBuilder.prototype = {
        constructor: TemplateBuilder,

        //store open spots/pos values here
        openSpots: {},

        //store explicitely closed (!) spots here
        //maybe not..? just delete from openSpots when encountered? That way we can override later in the json config to open it again?
        closedSpots: {},

        //final template of open spots
        //may not be necessary..
        template: {},

        loopThroughTemplate: function (id, template) {
          for(var key in this.checks){
            if(template.hasOwnProperty(key) && this.checks.hasOwnProperty(key)){
              if(!this.checkProperties(key, template[key])){
                return false;
              }
            }
          }
          return id;
        },

        checkProperties: function(prop, props){
          //!this.checks[key].call(this, template[key], template)
          var i = 0, l;
          props = typeof props === 'object' ? props : [props];
          l = props.l;
          for(i;i<l;i++){
            if(this.checks[prop].call(this, props[i], props)){
              return true;
            }
          }

          return false;
        },

        //may not be necessary..
        finaliseTemplate: function(inclusions, exclusions){
          for(var key in exclusions){
            if(exclusions.hasOwnProperty(key) && inclusions.hasOwnProperty(key)){
              delete inclusions[key];
            }
          }
          return inclusions;
        },

        checks: {
          test: function(template_value, template){
            return true;
          },

          where: function (template_value, template) {
            return false;
          },

          when: function (template_value, template) {
            return true;
          },

          what: function (template_value, template) {
            return true;
          }
        }
      };

      return TemplateBuilder;

    });
  }

})(window, document, define, commercialNode);