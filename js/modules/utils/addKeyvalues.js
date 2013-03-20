(function(d, define){

  'use strict';

  define(['utils/isArray'], function(isArray){

    /**
     * Assigns keyvalues to a the gpt publisher service, or a gpt ad slot
     * @param {Object} map Key/Value mapping
     * @param {Object} target GPT publisher service, or GPT ad slot
     */
    return function(map, target){
      for(var key in map){
        if(map.hasOwnProperty(key)){
          target.setTargeting(key, isArray(map[key]) ? map[key] : [map[key]]);
        }
      }
    };

  });

})(document, window.define);