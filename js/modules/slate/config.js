/**
 * Template of ad flights and available ad spots on slate.com (desktop)
 */

define(function(){

  return {
    flights: {
      defaults: {
        what: [
          '1x1',
          '150x29',
          '264x90',
          '300x600',
          '300x1050',
          '336x850',
          '400x140',
          'bigbox',
          'interstitial*',
          'leaderboard',
          'leftflex',
          'midarticleflex',
          'persistent_bb',
          'rightflex',
          'skyscraper',
          'toolbar'
        ]
      },
      homepage_defaults: {
        what: ['!leaderboard', 'tiffanytile'],
        where: ['homepage']
      },
      //14079
      siemens_sponsor: {
        what: ['1x1'],
        where: ['news/thehive'],
        hardcode: '<div style="text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#0C4790">' +
          'The Hive is sponsored by Siemens. ' +
          '<a href="http://ad.doubleclick.net/clk;226506771;50306605;a" target="_blank" style="color:#0C4790">' +
            'Find out more about Siemens rail solutions.' +
          '</a>' +
        '</div>'
      },
      //20280-CD
      lb_2_behold_blog: {
        what: ['leaderboard_2'],
        where: ['blogs/behold']
      },
      //chris schieffer email 10/5/12
      mini_bb: {
        what: ['bigbox*'],
        where: ['life/mini']
      },
      //21385-SC
      prudential_hive: {
        what: ['sponsor', 'featurebar', 'featurebar_2'],
        where: ['life/hive/secondacts']
      },
      //22161-LB
      marriott: {
        what: ['leaderboard', '468x60'],
        where: ['homepage'],
        when: ['20131112']
      }

    },

    adTypes: {
      'interstitial': { 'size': [['out of page']] },
      '1x1': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['onebyone'] } },
      '120x240bottom': { 'size' : [[120,240]], 'keyvalues' : { 'ad' : ['120x240'] } },
      '120x240top': { 'size' : [[120,240]], 'keyvalues' : { 'ad' : ['120x240'] } },
      '120x30': { 'size' : [[120,30]], 'keyvalues' : { 'ad' : ['120x30'] } },
      '120x60': { 'size' : [[120,60]], 'keyvalues' : { 'ad' : ['120x60'] } },
      '120x90': { 'size' : [[120,90]], 'keyvalues' : { 'ad' : ['120x90'] } },
      '150x29': { 'size' : [[150,29]], 'keyvalues' : { 'ad' : ['150x29'] } },
      '167x115': { 'size' : [[167,115]], 'keyvalues' : { 'ad' : ['167x115'] } },
      '264x90': { 'size' : [[264,90]], 'keyvalues' : { 'ad' : ['264x90'] } },
      '336x60': { 'size' : [[336,60]], 'keyvalues' : { 'ad' : ['336x60'] } },
      '336x90': { 'size' : [[336,90]], 'keyvalues' : { 'ad' : ['336x90'] } },
      '400x140': { 'size' : [[400,140]], 'keyvalues' : { 'ad' : ['400x140'] } },
      '468x60': { 'size' : [[468,60]], 'keyvalues' : { 'ad' : ['468x60'] } },
      '88x31': { 'size' : [[88,31]], 'keyvalues' : { 'ad' : ['88x31'] } },
      'agoogleaday': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['agoogleaday'] } },
      'bigad': { 'size' : [[1,1]] },
      'bigbox': { 'size' : [[300,250]], 'keyvalues' : { 'ad' : ['bb'] } },
      'comment': { 'size' : [[120,30]], 'keyvalues' : { 'ad' : ['comment'] } },
      'customcover': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['customcover'] } },
      'featurebar': { 'size' : [[446,33],[468,60]], 'keyvalues' : { 'ad' : ['fb'] } },
      'flip': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['flip'] } },
      'hive_textlinks': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['hive_textlinks'] } },
      'homepage_bb': { 'size' : [[300,250]] },
      'inline_vid': { 'size' : [[570,400]] },
      'leaderboard': { 'size' : [[728,90]], 'keyvalues' : { 'ad' : ['lb'] } },
      'leftflex': { 'size' : [[160,600],[336,850],[300,250]], 'keyvalues' : { 'ad' : ['ss','hp','bb'] } },
      'midarticleflex': { 'size' : [[446,33],[300,250]], 'keyvalues' : { 'ad' : ['fb','bb'] } },
      'meebo': { 'size' : [[55,21]], 'keyvalues' : { 'ad' : ['meebo'] } },
      'mostread': { 'size' : [[336,54],[336,90]], 'keyvalues' : { 'ad' : ['mostread'] } },
      'persistent_bb': { 'size' : [[300,600],[300,250]] },
      'pushdown': { 'size' : [[1,1]] },
      'rightflex': { 'size' : [[300,250],[160,600],[336,850],[300,600],[300,1050]], 'keyvalues' : { 'ad' : ['ss','hp','bb'] } },
      'skyscraper': { 'size' : [[160,600]], 'keyvalues' : { 'ad' : ['ss'] } },
      'sponsor': { 'size' : [[88,31]], 'keyvalues' : { 'ad' : ['sponsor'] } },
      'tiffanytile': { 'size' : [[264,90]], 'keyvalues' : { 'ad' : ['tiff'] } },
      'toolbar' : { 'size' : [[120,60]], 'keyvalues' : { 'ad' : ['120x60'] } },
      'tooltile': { 'size' : [[120,20],[120,30],[180,31],[70,100]], 'keyvalues' : { 'ad' : ['toolbox_tile'] } },
      'twitter': { 'size' : [[1,1]], 'keyvalues' : { 'ad' : ['twitter'] } }
    }
  };

});
