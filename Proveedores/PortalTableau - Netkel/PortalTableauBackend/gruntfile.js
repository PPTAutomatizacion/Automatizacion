/// <binding />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        cssmin: {
            dev: {
                files: {
                    "Content/app.min.css": [
                        'Content/fonts.googleapis.com.css',
                        'bower_components/motion-ui/dist/motion-ui.css',
                        'bower_components/foundation-sites/dist/foundation.min.css',
                        'bower_components/font-awesome/css/font-awesome.css',
                        'bower_components/pikaday/css/pikaday.css',
                        //'Content/Site.css',
                        //'Content/main.css',
                        'Content/colors.css'
                    ]
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015'],
                "extends": null
            },
            pub: {
                files: {
                    'bower_components/foundation.core.bab.js': 'bower_components/foundation.core.js',
                    'bower_components/foundation.util.mediaQuery.bab.js': 'bower_components/foundation.util.mediaQuery.js',
                    'bower_components/foundation.util.triggers.bab.js': 'bower_components/foundation.util.triggers.js',
                    'bower_components/foundation.abide.bab.js': 'bower_components/foundation.abide.js'
                }
            }
        },
        uglify: {
            dev: {
                files: {
                    'bower_components/blockUI/jquery.blockUI.min.js': ['bower_components/blockUI/jquery.blockUI.js'],
                    'bower_components/moment/moment.es.min.js': ['bower_components/moment/moment.js', 'bower_components/moment/locale/es.js'],
                    'Scripts/fileUpload.js': [
                        'bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload-process.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload-validate.js'
                    ],
                    'bower_components/foundation.core.min.js': ['bower_components/foundation.core.bab.js'],
                    'bower_components/foundation.util.triggers.min.js': ['bower_components/foundation.util.triggers.bab.js'],
                    'bower_components/foundation.abide.min.js': ['bower_components/foundation.abide.bab.js'],
                    'bower_components/foundation.util.mediaQuery.min.js': ['bower_components/foundation.util.mediaQuery.bab.js'],
                    'bower_components/pikaday/pikaday.min.js': ['bower_components/pikaday/pikaday.js']
                }
            }
        },
        copy: {
            dev: {
                files: [
                    { expand: true, flatten: true, src: ['bower_components/font-awesome/fonts/*'], dest: 'fonts/', filter: 'isFile' }
                ]
            },
            bab: {
                files: [
                    { src: ['bower_components/foundation-sites/js/foundation.core.js'], dest: 'bower_components/foundation.core.js' },
                    { src: ['bower_components/foundation-sites/js/foundation.util.triggers.js'], dest: 'bower_components/foundation.util.triggers.js' },
                    { src: ['bower_components/foundation-sites/js/foundation.abide.js'], dest: 'bower_components/foundation.abide.js' },
                    { src: ['bower_components/foundation-sites/js/foundation.util.mediaQuery.js'], dest: 'bower_components/foundation.util.mediaQuery.js' }
                ]
            },
            pdfdocs: {
                files: [
                    { expand: true, flatten: true, src: ['PdfDocuments/*.css', 'PdfDocuments/*.cshtml'], dest: 'bin/PdfDocuments', filter: 'isFile' }
                ]
            }
        },
        concat: {
            dev: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jquery-autocomplete/dist/jquery.autocomplete.min.js',
                    'bower_components/moment/moment.es.min.js',
                    'bower_components/blockUI/jquery.blockUI.min.js',
                    'bower_components/knockout/dist/knockout.js',
                    'bower_components/knockout-mapping/build/output/knockout.mapping-latest.js',
                    'bower_components/motion-ui/dist/motion-ui.min.js',
                    'bower_components/foundation-sites/dist/foundation.min.js',
                    'bower_components/pikaday/pikaday.min.js'
                ],
                dest: 'Scripts/bundle.min.js'
            },
            pub: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/motion-ui/dist/motion-ui.min.js',
                    'bower_components/foundation.core.min.js',
                    'bower_components/foundation.util.mediaQuery.min.js',
                    'bower_components/foundation.util.triggers.min.js',
                    'bower_components/foundation.abide.min.js'
                ],
                dest: 'Scripts/bundle.pub.min.js'
            }
        },
        watch: {
            pdfdocs: {
                files: ["PdfDocuments/*.css", "PdfDocuments/*.cshtml"],
                tasks: ["copy:pdfdocs"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("dev", ["cssmin", "copy:bab", "babel", "uglify", "copy:dev", "concat"]);
};