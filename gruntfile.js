module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      build: {
        options: {
          sassDir: 'public/scss',
          cssDir: 'public/css',
          outputStyle: 'compact',
          force: true,
          noLineComments: true
        }
      }
    },
    watch: {
      scss: {
        files: 'public/scss/**/*.scss',
        tasks: ['compass:build'],
      },
      build: {
        files: ['views/**.jade', 'structure.json'],
        tasks: 'build'
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-compass' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask('default', ['compass:build', 'watch']);
  grunt.registerTask('build', 'Build the html structure of the site from structure.json', function() {
    var builder = require('./builder.js');
    builder.build('structure.json', 'index.html');
  });
};
