/**
* Extends universal desktop, page level keyvalues with slate desktop specific keyvalues
*/
define([
  'utils',
  'keyvalues/desktop'
], function(utils, kvs){

  return utils.merge(kvs, {

    articleID: [
      function(){
        var segments = location.pathname.split('/'),
          pageEnd = segments[segments.length-1];
        return [pageEnd.split('.')[0] || ''];
      }
    ]

  });

});