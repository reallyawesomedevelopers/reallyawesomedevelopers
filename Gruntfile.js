module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		// lint all the js files
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			clientFiles: {
				src: 'app/js/*.js'
			}
		},
		// install bower stuff
		bower: {
			prod: {
				options: {
					targetDir: './dist/bower_components/'
				}
			},	
			dev: {
				options: {
					targetDir: './app/bower_components/'
				}
			}
		},
		// move files from client and into dist
		copy: {
			dist: {
				cwd: 'app',
				src: [ '**' ],
				dest: 'dist',
				expand: true
			},
		},
		// clean(deletes) the dist folder
		clean: {
			dist: {
				src: ['dist']
			},
			styles: {
				src: ['dist/css/*.css', '!dist/css/app.css']
			},
			scripts: {
				src: ['dist/js/*.js', '!dist/js/app.js']
			}
		},
		// minifies CSS
		cssmin: {
			dist: {
				files: {
					'dist/css/app.css': 'app/css/*.css'
				}
			}
		},
		// minifies JS
		uglify: {
			dist: {
				options: {
					mangle: false
				},
				files: {
					'dist/js/app.js': 'app/js/*.js'
				}
			}
		},
		// http server
		'http-server': {
			'dev': {
				// the server root directory
				root: './app',
				port: 8080,
				host: "127.0.0.1",
				// server default file extension
				ext: "html",
				// run in parallel with other tasks
				runInBackground: false
			},
			'prod': {
				// the server root directory
				root: './dist',
				port: 8080,
				host: "127.0.0.1",
				// server default file extension
				ext: "html",
				// run in parallel with other tasks
				runInBackground: false
			}
		},
		// build control for updating gh-pages with dist
		buildcontrol: {
			options: {
				dir: 'dist',
				commit: true,
				push: true,
				message: 'Syncing gh-pages with master.'
			},
			pages: {
				options: {
					remote: 'git@github.com:reallyawesomedevelopers/reallyawesomedevelopers.github.io.git',
					branch: 'gh-pages'
				}
			},
		},
		// live watcher for file changes
		watch: {
			clientFiles: {
				files: ['app/*'],
				tasks: ['jshint', 'default']
			}
		}
	});
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-build-control');
	// Tasks.
	grunt.registerTask('default', ['bower:dev', 'http-server:dev']);
	grunt.registerTask('prod', ['bower:prod', 'build', 'http-server:prod']);
	grunt.registerTask('push', ['build','buildcontrol:pages']);
	grunt.registerTask('build', ['clean:dist', 'copy', 'cssmin', 'uglify', 'clean:styles', 'clean:scripts']);
};