/* global connect: true, static: true */

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var sys = require('sys');
var exec = require('child_process').exec;

module.exports = function (grunt) {
  // load all grunt tasks:
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // display build times:
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      sass: ['.sass-cache'],
      js: ['js/min/*'],
      qunit: ['test/js']
    },
    uglify: {
      options: {
        //banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip',
        sourceMap: 'js/min/loader.map.js'
      },
      loader: {
        src: 'js/loader.js',
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
      build_all: [
        'build_js',
        'build_css'
      ],
      build_js: [
        'jshint:src',
        'jshint:gruntfile',
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
      slate: {
        path: 'http://localhost:<%= connect.options.port %>/slate.html'
      },
      wp_mobile: {
        path: 'http://localhost:<%= connect.options.port %>/mobile_homepage.html'
      },
      wp: {
        path: 'http://localhost:<%= connect.options.port %>/index.html'
      },
      wp_article: {
        path: 'http://localhost:<%= connect.options.port %>/article_placeAd2.html'
      },
      theroot: {
        path: 'http://localhost:<%= connect.options.port %>/theroot.html'
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
    }
  });


  //REGISTER TASKS BELOW:

  grunt.registerTask('default', [
    'build',
    'server'
  ]);

  grunt.registerTask('build', [
    'clean:js',
    'build_gpt',
    //'build_js',
    //'build_css',
    'concurrent:build_all',
    'test'
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

  grunt.registerTask('server', [
    'connect:livereload',
    'open:wp_article',
    'watch'
  ]);

  //custom gpt task:
  grunt.registerTask('build_gpt', 'Fetch latest gpt script from Google.', function(){
    var gpt_local = 'js/lib/gpt.js';
    var gpt_google = 'http://www.googletagservices.com/tag/js/gpt.js';

    //grab fresh copy of gpt script
    console.log('Grabbing ' + gpt_google + ' and saving to ' + gpt_local + '.');
    exec('curl --silent --create-dirs -o ' + gpt_local + ' ' + gpt_google);
  });

};
