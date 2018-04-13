module.exports = function(grunt) {
    // measures the time each task takes
    require("time-grunt")(grunt);

    // load time-grunt and all grunt plugins found in the package.json
    require("jit-grunt")(grunt);

    // grunt config
    grunt.initConfig({

        // Compile sass files
        sass: {
            options: {
                outputStyle: "expanded"
            },
            dist: {
                files: {
                    "dist/css/swipr.css": "src/scss/swipr.scss"
                }
            }
        },

        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: ["> 3%"]
            },
            files: {
                expand: true,
                flatten: true,
                src: "src/css/*.css",
                dest: "src/css/"
            }
        },

        // CSSmin
        cssmin: {
            options: {
                roundingPrecision: -1,
                sourceMap: false,
                level: 2
            },
            site: {
                files: [{
                    expand: true,
                    cwd: '/src/css',
                    src: ['*.css'],
                    dest: '/src/css'
                }]
            }
        },

        // Browser Sync
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        "./index.html"
                    ]
                },
                options: {
                    port: 7977, // SWPR on phone numpad
                    open: true, // Opens site in your default browser, no need to remember the port
                    notify: false,
                    watchTask: true,
                    injectChanges: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        },

        // Uglify
        uglify: {
            options: {
                sourceMap: false
            },
            build: {
                files: {
                    "dist/js/swipr.js": [
                        "src/js/swipr.js"
                    ]
                }
            }
        },

        // Watch files
        watch: {
            css: {
                files: [
                    "src/scss/*.scss",
                    "src/scss/**/*.scss"
                ],
                tasks: ["sass", "cssmin", "autoprefixer"],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            },
            javascript: {
                files: ["src/js/*.js"],
                tasks: ["uglify"],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            }
        }
    });

    // The dev task will be used during development
    grunt.registerTask("default", [
        "browserSync",
        "watch"
    ]);
};
