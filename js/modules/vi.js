define(['jQuery'], function($){
  return {
    exec: function(){
      //testing
      try{
        console.log('VI EXEC');
        console.log(arguments);
      } catch(e){}
    }
  };
});