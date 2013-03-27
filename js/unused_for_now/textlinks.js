/**
 * Builds quigo textlinks and returns them to page
 * @class textlinks
 */
(function(win, doc, cn, define) {

    'use strict';

    if (typeof define === "function") {


        define('textlinks', ["utils.core", "textlinks.templates", "textlinks.category"], function(utils, t, c) {
            var textlinks = {
                templates: t,
                category: c,
                article_check: function() {
                    return !utils.urlCheck('_Comments.html') && (utils.urlCheck('/wp-dyn/content/article/') || utils.urlCheck('/wp-dyn/content/discussion/')) ? true : false;
                },
                blog_check: function() {
                    return (utils.urlCheck(/\/\d{4}\/\d{2}\/.*\.htm/gi)) ? 'blog_permalink' : 'blog_main';
                },
                cat_check: function(cNode) {
                    if (textlinks.category[0][cNode]) {
                        return cNode;
                    }

                    var categories = textlinks.category,
                        l = cNode.match(/\//) ? categories.length : 1,
                        category, i;

                    while (l--) {
                        for (category in categories[l]) {
                            i = categories[l][category].length;
                            while (i--) {
                                if (cNode.match(new RegExp('^' + categories[l][category][i] + '(\/|$)'))) {
                                    return category;
                                }
                            }
                        }
                    }
                    return 'ros';
                },
                index_check: function() {
                    var k = ['politics', 'opinion', 'business', 'technology'],
                        j = k.length,
                        i;
                    for (i = 0; i < j; i++) {
                        if (cn.match(k[i])) {
                            return (cn.match(k[i] + '/')) ? false : 'index';
                        }
                    }
                    return 'index2';
                },
                init: function(contentType, position, cnode) {

                    contentType = textlinks.templates[contentType] ? contentType : 'CompoundStory';
                    cnode = textlinks.cat_check(cnode);

                    var cmpid = win.cmpid && win.cmpid.toLowerCase() || false,
                        template = cmpid && textlinks.templates[contentType][position][cmpid] || textlinks.templates[contentType][position].standard;
                    cnode = template[cnode] ? cnode : 'ros';


                    if (utils.urlCheck('debugAdCode') && win.console && typeof win.console.log === 'function') {
                        win.console.log('template=', contentType);
                        win.console.log('pos=', position);
                        win.console.log('channel=', cnode);
                        if (cmpid) {
                            win.console.log('Test Recipe:', 'cmpid=' + win.cmpid, template);
                        } else {
                            win.console.log('Standard Placement:', template);
                        }
                    }

                    return textlinks.build(template[cnode], position);
                },
                getTitle: function() {
                    var h = doc.title;
                    if (h && h !== "undefined") {
                        if (h.length > 100) {
                            h = h.substring(0, 50) + "-" + h.substring(h.length - 50, h.length);
                        }
                    }
                    return escape(h);
                },
                getMetaVals: function() {
                    return encodeURIComponent((win.wp_meta_data.keywords || []).join(',')).replace(/\%2C/g, ',').slice(0, 100);
                },
                getSlug: function(pos) {
                    return doc.getElementById('wpni_adi_' + pos) || doc.getElementById('slug_' + pos);
                },
                build: function(template, position) {
                    var url = win.location,
                        adsonar_placementId = template[0],
                        adsonar_pid = template[1],
                        adsonar_ps = /^local/.test(cn) ? '0' : '-1',
                        adsonar_zw = template[2],
                        adsonar_zh = template[3],
                        rand = Math.floor(Math.random() * 1E6),
                        srcUrl = "http://ads.adsonar.com/adserving/getAds.jsp?previousPlacementIds=&placementId=" + adsonar_placementId + "&pid=" + adsonar_pid + "&ps=" + adsonar_ps + "&zw=" + adsonar_zw + "&zh=" + adsonar_zh + "&url=" + escape(url) + "&v=5&dct=" + textlinks.getTitle() + "&metakw=" + textlinks.getMetaVals();

                    textlinks.render(textlinks.iframeBuilder({
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
                iframeBuilder: function(atts) {
                    var i = doc.createElement('iframe'),
                        key;

                    atts = atts || {};

                    //defaults
                    i.frameBorder = "0";
                    i.height = "0";
                    i.width = "0";
                    i.scrolling = "no";
                    i.marginHeight = "0";
                    i.marginWidth = "0";

                    for (key in atts) {
                        if (atts.hasOwnProperty(key)) {
                            i[key] = atts[key];
                        }
                    }

                    return i;
                },
                render: function(element, pos) {
                    var slug = textlinks.getSlug(pos);
                    if (slug) {
                        slug.appendChild(element);
                    }
                }
            };
            return textlinks;
        });

    }


})(window, document, window.commercialNode, window.define);
