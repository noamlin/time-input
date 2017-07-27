module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	grunt.initConfig({
		watch: {
			styles: {
				files: ['src/*.less'], // which files to watch
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: ['src/*.js'], // which files to watch
				tasks: ['uglify'],
				options: {
					nospawn: true
				}
			}
		},
		less: {
			development: {
				options: {
					compress: false,
					yuicompress: false,
					optimization: 2
				},
				files: {
					"dist/time-input.css": "src/time-input.less"
				}
			},
			production: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					"dist/time-input.min.css": "src/time-input.less"
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				screwIE8: true
			},
			development: {
				options: {
					compress: false,
					beautify: {
						beautify: true,
						"indent_level": 2
					}
				},
				files: {
					'dist/time-input.js': ['src/time-input.js']
				}
			},
			production: {
				options: {
					compress: true,
					sourceMap: true,
					sourceMapName: 'dist/time-input.min.js.map'
				},
				files: {
					'dist/time-input.min.js': ['src/time-input.js']
				}
			}
		}
	});

	grunt.registerTask('watch-files', ['watch']);

	grunt.registerTask('dist', ['less', 'uglify']);
};