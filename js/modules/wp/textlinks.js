define(['utils', 'wp/textlinks_config'], function(utils, config){

  var textlinks = {

    templates: config.templates,
    category: config.category,

    init: function(contentType, position, cnode) {

      contentType = textlinks.templates[contentType] ? contentType : 'CompoundStory';
      cnode = textlinks.cat_check(cnode);

      var cmpid = window.cmpid && window.cmpid.toLowerCase() || false,
          template = cmpid && textlinks.templates[contentType][position][cmpid] || textlinks.templates[contentType][position].standard;
      cnode = template[cnode] ? cnode : 'ros';

      if(utils.urlCheck('debugAdCode') && window.console && typeof window.console.log === 'function') {
        window.console.log('template=', contentType);
        window.console.log('pos=', position);
        window.console.log('channel=', cnode);
        if(cmpid){
          window.console.log('Test Recipe:', 'cmpid=' + window.cmpid, template);
        } else{
          window.console.log('Standard Placement:', template);
        }
      }

      return textlinks.build(template[cnode], position);
    },
    cat_check: function(cNode) {
      if(textlinks.category[0][cNode]) {
        return cNode;
      }

      var categories = textlinks.category,
        l = cNode.match(/\//) ? categories.length : 1,
        category, i;

      while(l--) {
        for(category in categories[l]) {
          i = categories[l][category].length;
          while(i--) {
            if(cNode.match(new RegExp('^' + categories[l][category][i] + '(\/|$)'))) {
              return category;
            }
          }
        }
      }
      return 'ros';
    },
    article_check: function() {
      return !utils.urlCheck('_Comments.html') && (utils.urlCheck('/wp-dyn/content/article/') || utils.urlCheck('/wp-dyn/content/discussion/')) ? true : false;
    },
    index_check: function() {
      var k = ['politics', 'opinion', 'business', 'technology'],
        j = k.length,
        i;
      for(i = 0; i < j; i++) {
        if(commercialNode.match(k[i])) {
          return(commercialNode.match(k[i] + '/')) ? false : 'index';
        }
      }
      return 'index2';
    },
    blog_check: function() {
      return(utils.urlCheck(/\/\d{4}\/\d{2}\/.*\.htm/gi)) ? 'blog_permalink' : 'blog_main';
    },
    //return the parsed document title
    getTitle: function() {
      var h = document.title;
      if(h && h !== "undefined") {
        if(h.length > 100) {
          h = h.substring(0, 50) + "-" + h.substring(h.length - 50, h.length);
        }
      }
      return escape(h);
    },
    //return the meta keywords as an URL safe encoded String (limited to 100 chars)
    getMetaVals: function() {
      return encodeURIComponent((window.wp_meta_data.keywords || []).join(',')).replace(/\%2C/g, ',').slice(0, 100);
    },
    //get the target container to append the textlinks to
    getSlug: function(pos){
      return document.getElementById('wpni_adi_' + pos) || document.getElementById('slug_' + pos);
    },
    //build the quigo iframe URL, generate the iframe and pass it to textlinks.render to render it
    build: function(template, position) {
      var url = window.location,
        adsonar_placementId = template[0],
        adsonar_pid = template[1],
        adsonar_ps = /^local/.test(commercialNode) ? '0' : '-1',
        adsonar_zw = template[2],
        adsonar_zh = template[3],
        rand = Math.floor(Math.random() * 1E6),
        srcUrl = "http://ads.adsonar.com/adserving/getAds.jsp?previousPlacementIds=&placementId=" + adsonar_placementId + "&pid=" + adsonar_pid + "&ps=" + adsonar_ps + "&zw=" + adsonar_zw + "&zh=" + adsonar_zh + "&url=" + escape(url) + "&v=5&dct=" + textlinks.getTitle() + "&metakw=" + textlinks.getMetaVals();


      textlinks.render(utils.iframeBuilder({
        'src': srcUrl,
        'id': "adsonar_serve" + rand,
        'name': "adsonar_serve" + rand,
        'width': adsonar_zw,
        'height': adsonar_zh,
        'vspace': '0',
        'hspace': '0'
      }), 'sponsor_links_' + position);
      return true;
    },
    //render the iframe by appending it to the slug container div
    render: function(element, pos){
      var slug = textlinks.getSlug(pos);
      if(slug){
        slug.appendChild(element);
      }
    }
  };

  return textlinks;
});