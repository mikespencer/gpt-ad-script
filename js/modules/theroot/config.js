define(function() {

  return {
    flights: {
      defaults: {
        what: [
          '180x88',
          '234x60',
          '336x60',
          '336x60_homepage',
          '45x45',
          'bigbox',
          'flex',
          'interstitial*',
          'leaderboard',
          'midarticleflex',
          'tiffanytile'
        ]
      },
      homepage_defaults: {
        what: ['!leaderboard'],
        where: ['homepage']
      },
      mappingtool_defaults: {
        what: ['!flex_2'],
        where: ['roots/mappingtool']
      },
      root100_defaults: {
        what: ['!midarticleflex'],
        where: ['views/root100']
      },

      //99999-CD
      twits: {
        what: ['leaderboard_2', 'leaderboard_3', 'leaderboard_4'],
        where: ['views/root_twitterati']
      },
      //xxx-ROOT
      slideshow: {
        what: ['flex*']
      }
    },

    adTypes: {
      '120x90': { 'size': [[120,90]], 'keyvalues': { 'ad': ['120x90'] } },
      '180x88': { 'size': [[180,88]], 'keyvalues': { 'ad': ['180x88'] } },
      '234x60': { 'size': [[234,60]], 'keyvalues': { 'ad': ['234x60'] } },
      '336x60': { 'size': [[336,60]], 'keyvalues': { 'ad': ['336x60'] } },
      '336x60_homepage': { 'size': [[336,60]], 'keyvalues': { 'ad': ['336x60_homepage'] } },
      '336x90': { 'size': [[336,90]], 'keyvalues': { 'ad': ['336x90'] } },
      '45x45': { 'size': [[45,45]], 'keyvalues': { 'ad': ['45x45'] } },
      '88x31': { 'size': [[88,31]], 'keyvalues': { 'ad': ['88x31'] } },
      'bigbox': { 'size': [[300,250]], 'keyvalues': { 'ad': ['bb'] } },
      'flex': { 'size': [[300,250],[336,850],[160,600],[300,600],[300,1050]], 'keyvalues': { 'ad': ['bb','hp','ss'] } },
      'headerTile': { 'size': [[234,60],[290,60],[300,45]], 'keyvalues': { 'ad': ['tiff'] } },
      'interstitial': { 'size': [['out of page']] },
      'leaderboard': { 'size': [[728,90]], 'keyvalues': { 'ad': ['lb'] } },
      'midarticleflex': { 'size': [[300,250],[446,33]], 'keyvalues': { 'ad': ['bb'] } },
      'rightbigbox': { 'size': [[300,250]], 'keyvalues': { 'ad': ['bb'] } },
      'sponsor': { 'size': [[1,1]] },
      'super_leaderboard': { 'size': [[900,90]] },
      'tiffanytile': { 'size': [[234,60],[290,60],[300,45]], 'keyvalues': { 'ad': ['tiff'] } }
    }
  };


});