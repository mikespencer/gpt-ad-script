(function(d, define){

  'use strict';

  define(function(){

    /**
     * Checks the URL for a value
     * @param {String} arg Value to check for in the URL
     * @param {Object} opt_variable Object with the format of {type: 'variable'} to return the value
     *    after the = sign of the first argument. EG: 'test=123' would return '123'
     * @return {Boolean|null|String} true for a match, null for no match, or String if opt_variable
     *    and a match.
     */
    return function (arg, opt_variable) {
      var loc = parent.window.location.href || d.referrer,
        obj = (opt_variable && typeof opt_variable === 'object') ? opt_variable : null,
        regex = (obj !== null && obj.type === 'variable') ? new RegExp("[\\?&;]" + arg + "=([^&#?]*)") : new RegExp(arg),
        results = regex.exec(loc);
      return (results === null) ? null : results[results.length - 1];
    };

  });

})(document, window.define);