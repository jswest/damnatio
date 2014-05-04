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
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-compass' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask('default', ['compass:build', 'watch']);
};
