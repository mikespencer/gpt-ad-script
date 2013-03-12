/**
 * Checks and builds an ad template of open spots on the current page
 */
(function(w, d, define, commercialNode){

  'use strict';

  if(typeof define === 'function'){
    define('templateBuilder', ['utils.core'], function(utils){

      var templateBuilder = {

        exec: function(json){
          templateBuilder.template = {};
          for(var key in json){
            if(json.hasOwnProperty(key)){
              json[key].id = key;
              if(templateBuilder.checkFlight(json[key])){
                templateBuilder.addToTemplate(json[key]);
              }
            }
          }
          return templateBuilder.template;
        },

        checkFlight: function(template){
          var key;
          for(key in templateBuilder.checks){
            if(templateBuilder.checks.hasOwnProperty(key) && template.hasOwnProperty(key)){
              if(!templateBuilder.checkProperty(key, template[key])){
                return false;
              }
            }
          }
          return true;
        },

        checkProperty: function(prop, val){
          val = utils.isArray(val) ? val : [val];

          var l = val.length,
            i = 0,
            check = false;

          for(i;i<l;i++){
            if(templateBuilder.checks[prop](val[i])){
              check = true;
            }
          }
          return check;
        },

        addToTemplate: function(template){
          if(template.what){
            var pos = template.what, l = pos.length, i = 0, newPos;
            for(i;i<l;i++){
              if(/^\!/.test(pos[i])){
                newPos = pos[i].split(/\!/)[1];
                if(templateBuilder.template[newPos]){
                  delete templateBuilder.template[newPos];
                }
              } else {
                templateBuilder.template[pos[i]] = template;
              }
            }
          }
        },

        //true/false checks:
        checks: {
          test: function(val){
            return typeof val === 'function' ? val() : val;
          },

          where: function(where){
            var open = true;
            if(/^\!/.test(where)){
              open = false;
              where = where.split('!')[1];
            }
            return new RegExp('^' + where).test(w.commercialNode) ? open : false;
          },

          when: function (when) {
            when = when.split('/');
            return when[0] <= utils.estNowWithYear && when[1] >= utils.estNowWithYear;
          }
        }

      };

      return templateBuilder;

    });
  }

})(window, document, define, commercialNode);