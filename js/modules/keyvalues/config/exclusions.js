define(['modules/utils'], function(utils){

  return function(){
    var rv = [],
      obj = {
        natural_disaster : ['shell', 'exxon', 'citgo', 'bp', 'chevron', 'hess', 'sunoco',
          'disaster', 'fire', 'explosion', 'oil', 'coal', 'death', 'dead', 'quake', 'earthquake',
          'tsunami', 'tornado', 'hurricane', 'flood','bed bug','infestation'],
        human_disaster : ['shoot', 'vatican', 'spanair', 'aground', 'rescue', 'attack', 'disaster',
          'explosion', 'war', 'hostage', 'terror', 'terrorist', 'bomb', 'blast', 'mining', 'miner',
          'violence', 'riot', 'crash', '9/11', 'sept. 11', 'september 11'],
        financial_crisis : ['corrupt', 'goldman', 'aig', 'foreclosure', 'enron', 'sec', 'mortgage',
          'Insurance', 'health', 'bank', 'wall street', 'protest', 'labor strike', 'union strike',
          'labor issue', 'union issue', 'teacher strike', 'teachers strike', 'election'],
        inappropriate : ['gambling','sex','alcohol','pornography']
      },
      key;

    if(!utils.flags.front) {
      for(key in obj) {
        if(obj.hasOwnProperty(key) && utils.wordMatch(obj[key], utils.keywords)) {
          rv.push(key);
        }
      }
    }

    return rv;
  };

});