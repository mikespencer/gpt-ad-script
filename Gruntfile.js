/*jshint node:true, es5:true */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var sys = require('sys');
var exec = require('child_process').exec;
var cheerio = require('cheerio');

module.exports = function (grunt) {
  // load all grunt tasks:
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // display build times:
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      sass: ['.sass-cache'],
      js: ['js/min/*'],
      qunit: ['test/js'],
      testpages: ['*.html'],
      tmp: ['tmp']
    },
    uglify: {
      options: {
        //banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip',
        sourceMap: 'js/min/loader.map.js'
      },
      loader: {
        src: ['js/lib/yepnope.js', 'js/loader.js'],
        dest: 'js/min/loader.min.js'
      }
    },
    jshint: {
      options:{
        ignores: ['js/debugBookmarklet.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/modules/**/*.js', 'js/*.js']
      },
      libs: {
        src: ['js/lib/krux.js']
      },
      qunit: {
        src: ['test/tests/*.js']
      }
    },
    requirejs: {
      options: {
        almond: true,
        wrap: true,
        baseUrl: "js/modules",
        include: ['main'],
        preserveLicenseComments: false,
        optimize: 'uglify2',
        //optimize: 'none',
        generateSourceMaps: true,
        shim: {
          'gpt': {
            exports: 'googletag'
          }
        }
      },
      wp: {
        options: {
          out: 'js/min/wp.min.js',
          paths: {
            'gpt': '../lib/gpt',
            'siteScript': 'wp/main'
          }
        }
      },
      slate: {
        options: {
          out: 'js/min/slate.min.js',
          paths: {
            'gpt': '../lib/gpt',
            'siteScript': 'slate/main'
          }
        }
      },
      theroot: {
        options: {
          out: 'js/min/theroot.min.js',
          paths: {
            'gpt': '../lib/gpt',
            'siteScript': 'theroot/main'
          }
        }
      },
      wp_mobile: {
        options: {
          out: 'js/min/wp_mobile.min.js',
          paths: {
            'gpt': '../lib/gpt',
            'siteScript': 'wp_mobile/main'
          }
        }
      },
      slate_mobile: {
        options: {
          out: 'js/min/slate_mobile.min.js',
          paths: {
            'gpt': '../lib/gpt',
            'siteScript': 'slate_mobile/main'
          }
        }
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      build_js: {
        files: ['js/modules/**/*.js', 'js/loader.js', 'js/debug.js'],
        tasks: ['build_js']
      },
      build_css: {
        files: ['css/sass/**/*.sass'],
        tasks: ['build_css']
      },
      tests: {
        files: ['test/**/*'],
        tasks: ['concurrent:qunit']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '*.html',
          'js/min/*.js',
          'css/*',
          'img/*'
        ]
      }
    },
    connect: {
      options: {
        port: 5000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.')
            ];
          }
        }
      }
    },
    //faster buld time:
    concurrent: {
      clean_build: [
        'clean:js',
        'clean:testpages',
        'clean:qunit',
        'clean:tmp'
      ],
      build_all: [
        'build_js',
        'build_css'
      ],
      build_js: [
        'jshint:src',
        //'jshint:gruntfile',
        'jshint:libs',
        'requirejs:wp',
        'requirejs:wp_mobile',
        'requirejs:slate',
        'requirejs:theroot',
        'requirejs:slate_mobile',
        'uglify:loader'
      ],
      qunit: [
        'qunit:wp_article',
        'qunit:wp_mobile',
        'qunit:slate'
      ]
    },
    open: {
      index: {
        path: 'http://localhost:<%= connect.options.port %>/index.html'
      },
      wp: {
        path: 'http://localhost:<%= connect.options.port %>/wp_homepage.html'
      },
      slate: {
        path: 'http://localhost:<%= connect.options.port %>/slate_homepage.html'
      }
    },
    copy: {
      qunit: {
        files: [
          {expand: true, src: ['js/**'], dest: 'test'}
        ]
      }
    },
    qunit: {
      all: ['test/**/*.html'],
      wp_article: ['test/wp_article_tests.html'],
      wp_mobile: ['test/wp_mobile_tests.html'],
      slate: ['test/slate_tests.html']
    },

    //test page generation:
    curl: {
      wp_homepage: {
        src: 'http://www.washingtonpost.com',
        dest: 'tmp/wp/wp_homepage.html'
      },
      wp_front: {
        src: 'http://www.washingtonpost.com/politics',
        dest: 'tmp/wp/wp_front.html'
      },
      wp_article: {
        src: 'http://www.washingtonpost.com/national/health-science/healthcaregov-fixes-wont-be-done-until-end-of-november/2013/10/25/22df29ba-3d93-11e3-b7ba-503fb5822c3e_story.html',
        dest: 'tmp/wp/wp_article.html'
      },
      wp_article_single_page: {
        src: 'http://www.washingtonpost.com/055f8e9c-2ab1-11e3-8ade-a1f23cda135e_story.html',
        dest: 'tmp/wp/wp_article_single_page.html'
      },
      wp_blog: {
        src: 'http://www.washingtonpost.com/blogs/post-politics/',
        dest: 'tmp/wp/wp_blog.html'
      },
      wp_games: {
        src: 'http://games.washingtonpost.com/',
        dest: 'tmp/wp/wp_games.html'
      },
      wp_rentals: {
        src: 'http://www.washingtonpost.com/rentals',
        dest: 'tmp/wp/wp_rentals.html'
      },
      wp_realestate: {
        src: 'http://www.washingtonpost.com/realestate',
        dest: 'tmp/wp/wp_realestate.html'
      },
      wp_gog: {
        src: 'http://www.washingtonpost.com/goingoutguide',
        dest: 'tmp/wp/wp_gog.html'
      },

      slate_homepage: {
        src: 'http://www.slate.com',
        dest: 'tmp/slate/slate_homepage.html'
      },
      slate_front: {
        src: 'http://www.slate.com/articles/news_and_politics.html',
        dest: 'tmp/slate/slate_front.html'
      },
      slate_article: {
        src: 'http://www.slate.com/articles/news_and_politics/roads/2013/10/unesco_and_japanese_culinary_tradition_can_a_u_n_body_s_designation_save.html',
        dest: 'tmp/slate/slate_article.html'
      },

      theroot_homepage: {
        src: 'http://www.theroot.com',
        dest: 'tmp/theroot/theroot_homepage.html'
      },
      theroot_front: {
        src: 'http://www.theroot.com/articles/politics.html',
        dest: 'tmp/theroot/theroot_front.html'
      },
      theroot_article: {
        src: 'http://www.theroot.com/articles/politics/2013/11/harry_belafonte_compares_koch_bros_to_the_kkk.html',
        dest: 'tmp/theroot/theroot_article.html'
      }
    }
  });


  //REGISTER TASKS BELOW:

  grunt.registerTask('default', [
    'concurrent:clean_build',
    'build',
    'test',
    'testpages',
    'server'
  ]);

  grunt.registerTask('build', [
    'build_gpt',
    'concurrent:build_all'
  ]);

  grunt.registerTask('build_js', [
    'concurrent:build_js'
  ]);

  grunt.registerTask('build_css', [
    'compass'
  ]);

  grunt.registerTask('test', [
    'jshint:qunit',
    'clean:qunit',
    'copy:qunit',
    'concurrent:qunit',
    'clean:qunit'
  ]);

  grunt.registerTask('testpages', [
    'clean:testpages',
    'curl',
    'local_refs',
    'clean:tmp'
  ]);

  grunt.registerTask('server', [
    'connect:livereload',
    'open:index',
    'watch'
  ]);

  //custom gpt grabber task:
  grunt.registerTask('build_gpt', 'Fetch latest gpt script from Google.', function(){
    var gpt_local = 'js/lib/gpt.js';
    var gpt_google = 'http://www.googletagservices.com/tag/js/gpt.js';

    //grab fresh copy of gpt script
    console.log('Grabbing ' + gpt_google + ' and saving to ' + gpt_local + '.');
    exec('curl --silent --create-dirs -o ' + gpt_local + ' ' + gpt_google);
  });

  //custom task that generates test pages referencing local gpt scripts
  grunt.registerTask('local_refs', 'Replaces ad script references in downloaded test pages to local refs', function(){

    var index_html_data = {};

    grunt.file.recurse('tmp', function(abspath, rootdir, subdir, filename){

      var html = grunt.file.read(abspath);
      var $ = cheerio.load(html);

      //subdir should be the correct data-ad-site value (wp, slate, theroot, etc)
      var data = {
        'ad-site': subdir
      };

      //fix for relative urls:
      var bases = {
        theroot: 'http://www.theroot.com'
      }

      if(subdir === 'slate'){
        data['ad-page-type'] = 'responsive';
      }

      //attempt to make all relative links absolute:
      if(bases[subdir]){
        $('script:not([src^="http:"]), script:not([src^="//"]), ' +
          'link:not([href^="http:"]), link:not([href^="//"]), ' +
          'img:not([src^="http:"]), img:not([src^="//"])').each(function(){
          if($(this).attr('src')){
            var src = $(this).attr('src').replace(/^\//, ''); //no leading /
            $(this).attr({
              src: bases[subdir] + '/' + src
            });
          } else if($(this).attr('href')){
            var href = $(this).attr('href').replace(/^\//, ''); //no leading /
            $(this).attr({
              href: bases[subdir] + '/' + href
            });
          }
        });
      }

      //remove existing site specific ad script references
      $('script[src*="/wp-srv/ad/wp.js"], ' +
        'script[src*="/wp-srv/ad/wp_ad.js"], ' +
        'script[src*="/wp-srv/ad/root.js"], ' +
        'script[src*="/wp-srv/ad/slate.js"], ' +
        'script[src*="/wp-srv/ad/slate_mobile.js"], ' +
        'script[src*="/wp-srv/ad/wp_mobile.js"]').remove();

      //replace the generic ad script on the page with a reference to our new loader.min.js script
      $('script[src*="/wp-srv/ad/loaders/latest/js/min/loader.min.js"], ' +
        'script[src*="/wp-srv/ad/generic_ad.js"], ' +
        'script[src*="/wp-srv/ad/wpni_generic_ad.js"], ' +
        'script[src*="jsGroups=adScripts"], ' +
        'script[src*="/wp-srv/ad/responsive_ad.js"], ' +
        'script[src*="/wp-srv/ad/min/responsive_ad.js"], ' +
        'script[src*="/wp-srv/ad/slate_responsive.js"], ' +
        'script[src*="/wp-srv/ad/min/slate_responsive.js"]')
      .first()
      .attr({
        src: 'http://localhost:5000/js/min/loader.min.js?cacheBuster=' + Math.floor(Math.random() * 1E3)
      })
      .data(data);

      //rewrite the file with updated refs
      grunt.file.write(filename, $.html());

      grunt.log.ok('Generated and parsed: ' + filename);

      //store data for generating the index.html page
      index_html_data[subdir] = index_html_data[subdir] || [];
      index_html_data[subdir].push('    <li><a href="' + filename + '">' + filename.split('.')[0] + '</a></li>');

    });

    //index page generation start:
    var output = [
      '<!DOCTYPE html>',
      '<!-- This file is dynamically generated via Gruntfile.js and the localise_testpages task -->',
      '<html>',
      '<head>',
      '  <title>Test Pages</title>',
      '  <link rel="stylesheet" href="bower_components/normalize-css/normalize.css" type="text/css" />',
      '  <style type="text/css">body{padding:0 25px;}</style>',
      '</head>',
      '<body>\n',
      '  <h1>Test Pages</h1>'
    ];

    for(var key in index_html_data){
      if(index_html_data.hasOwnProperty(key)){
        output.push('  <h2>' + key + '</h2>');
        output.push('  <ul>');
        output.push(index_html_data[key].join('\n'));
        output.push('  </ul>');
      }
    }

    output.push('\n</body>');
    output.push('</html>');
    grunt.file.write('index.html', output.join('\n'));
    //index page generation end.

    grunt.log.ok('Generated: index.html');

  });

};
