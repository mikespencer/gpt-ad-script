define({
  load: function(name, req, onload, config){
    //req has the same API as require().
    var n = name.split('|'),
      check = n[0],
      module = n[1];

    if(window.location.search.match(check)){
      req([module], function(a){
        onload(a);
      })
    } else{
      onload({});
    }
  }
});