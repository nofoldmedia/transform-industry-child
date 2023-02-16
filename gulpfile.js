/**
 * 
 * 	Gulp 4 file using Node 16
 * 
 * 	Dependancies 
 * 	- Boostrap
 * 
 * 	Tasks
 * 	- Styles
 * 
 * 	Objective: Run tasks to create a build dir containg the site assests
 * 
 */

/** 
 * 
 * 	Run 'npm install' in root dir to load nodules
 * 
*/
/** 
 * 
 * 	Contents
 * 	- Paths
 * 	- Require gulp plugins
 * 	- Tasks
 * 	-- Vendor SCSS
 * 	-- Styles
 * 	-- Gulp tasks
 * 	-- Expose tasks
 * 
*/

'use strict';

// Paths
// -----------------------
const config = {
	themeScssPath: 				'library/scss',								// Theme asset paths for theme SCSS
	themeJsPath:       			'library/js/',								// Theme asset paths for theme JS
	nmPath:      				'./node_modules/',							// Node modules src assets root path
	destCss:        			'build/css',								// destination of compiled CSS
	destJs:        				'build/js',									// destination of compiled SCRIPTS
	themeScssPathAll:       	'library/scss/**/*.scss',					// Paths to src files to watch for 'styles task'
	themeJsPathAll:       		'library/js/**/*.js',						// Paths to src files to watch for 'scripts task'	
};

// Gulp plugins
// -----------------------
const { src, dest, series, parallel } = require('gulp'),
	gulp = require('gulp'),
	scss = require('gulp-sass')(require('sass')), 			// npm install sass gulp-sass --save-dev
	plumber = require('gulp-plumber'),						// npm install --save-dev gulp-plumber
	rename = require('gulp-rename'),				// Add source maps to css file					// npm install --save-dev gulp-notify
	sourcemaps = require('gulp-sourcemaps'),				// npm install --save-dev gulp-sourcemaps		// Add source maps to css file
	// sasslint = require('gulp-sass-lint')		// npm install --save-dev gulp-sass-lint
	notify = require('gulp-notify'),
	browsersync = require('browser-sync').create(),
	//
	gulpLoadPlugins = require('gulp-load-plugins'),
	// plugins = gulpLoadPlugins();	
	//
	// // scss = requirxe('gulp-scss'),					// Scss parser
	// autoprefixer = require('gulp-autoprefixer'),
	// buster = require('gulp-asset-hash'),
	// cleanCSS = require('gulp-clean-css'),			// Minify CSS
	// concat = require('gulp-concat'),				// Add source maps to css file
	// lintcss = require('gulp-sass-lint'),		// Error handler that keeps things moving
	// sasslint = require('gulp-sass-lint'),
	
	uglify = require('gulp-uglify');
	
	const plugins = gulpLoadPlugins();	 
	


// ===========================================================================================================
// Add the JS files here (these are compiled out from the bower directory and placed in the vendor_libs folder)
// Alternatively, just refer to the bower folders directly if you like
// Uncomment the ones we have already added if you need to use them
// ===========================================================================================================

var jsFileListQueue = [
	config.nmPath  	+ 'enquire.js/dist/enquire.js', // npm install enquire.js --save-dev
	// // config.nmPath  	+ 'respond/src/respond.js', // OOOOOLD css 3 enabler
	// // config.nmPath + 'bootstrap-sass/assets/javascripts/bootstrap.js',
	config.nmPath + 'bootstrap/dist/js/bootstrap.js',
	config.nmPath	+ '/jquery-match-height/dist/jquery.matchHeight.js', //npm install --save jquery-match-height
	config.nmPath	+ 'slick-carousel/slick/slick.js', // npm install slick-carousel
	// // config.nmPath	+ 'lightgallery/dist/js/lightgallery-all.js',
	// // config.nmPath	+ 'imagesloaded/imagesloaded.pkgd.js', // not used in masonary
	// // config.nmPath   + 'isotope-layout/dist/isotope.pkgd.js', // not used
	// // config.nmPath   + 'isotope-packery/packery-mode.pkgd.js', // not used
	// config.nmPath 	+ 'sticky-sidebar/dist/jquery.sticky-sidebar.js', // not used (i think)
	config.themeJsPath	+ '/acf-map/acf-map.js',
	config.themeJsPath 	+ '/scripts.js'
];


// Vendor SCSS
// -----------------------
const vendorScssList = [
	config.nmPath + 'normalize-scss/sass/normalize/_import-now.scss',
];


// Styles task
// -----------------------
function buildStyles() {
	return gulp.src(config.themeScssPath + '/styles.scss') // Theme root SCSS file that imports all other partials
		.pipe(plumbError())
		.pipe(scss({
			includePaths: 'node_modules/bootstrap-sass/assets/stylesheets/' // Bootstrap partials path
		}))
		.pipe(sourcemaps.init())
		.pipe(
			scss({
				includePaths: vendorScssList,
		        // outputStyle: 'compressed',
		        // precision: 10,
		        // includePaths: ['.'],
		    })
			.on('error',function(err) {
		        sass.logError;  				// I think we should also print in the console
		        return notify().write(err); 	// and the notification bar
		    })
		)
		.pipe(scss({
			includePaths: 'node_modules/normalize-scss/sass/' // Bootstrap partials path
		}))	
	
		//   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
		.pipe(rename('styles.min.css'))
		// .pipe(cleanCSS({
		// 	format: 'beautify', // formats output in a really nice way
		// 	level: 2			// strict cleaning of the CSS
		// }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.destCss))
	.pipe(browsersync.stream());
}

// BrowserSync task (callback)
// -----------------------
function browserSync(done) {
  browsersync.init({
	proxy: "https://transform.local", 										// Change this value to match your local URL.
    socket: {
      domain: 'https://localhost:3000'
    }
  });
  done();
}

// Browsersync reload task (callback)
// -----------------------
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch tasks
// -----------------------
function watchFiles(){	
	gulp.watch(config.themeScssPathAll, gulp.series(buildStyles, browserSyncReload));		// Watch for style changes in 'lib' & 'theme'
	gulp.watch(config.themeJsPathAll, gulp.series(buildScripts, browserSyncReload));		// Watch for script changes in 'lib' & 'theme'
	// gulp.watch(
	// // 	[
	// // 	"./**/*.php", 
	// // 	"./**/*.twig"
	// // 	],
	// 	gulp.series(browserSyncReload)
	// )
}


// Scripts task
// -----------------------
function buildScripts() {	
	return gulp 	
	.src(jsFileListQueue)
	.pipe(plumbError())
	.pipe(plugins.concat({
		path: config.destJs + '/scripts.js',
		cwd: ''
	}))		
	.pipe(sourcemaps.init())												
	.pipe(rename('scripts.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest(config.destJs))
	// .pipe(buster.hash({
	// 	manifest: './build/manifest.json',
	// 	template: '<%= name %>-<%= hash %>.<%= ext %>',
	// 	replace: true
	// }))			
	// .pipe(plumber({errorHandler: reportError}))
	// .pipe(gulp.dest(config.destJs))
	.pipe(sourcemaps.write())
	.pipe(browsersync.stream());
}

// Sass lint task
// -----------------------
// Sublimtext - if package SublimeLinter-contrib-sass-lint is installed. 
// 'Ctrl + Cmd' + 'a' to oopen lint console
function sassLinter () {
  return gulp
  	.src([
  		'library/scss/theme/**/*.scss' // we only want to lint our own scss
  	])
	.pipe(sasslint({
		options: {
			configFile: 'sass-lint.yml' // Lint rules
		}
	})
	)
  	.pipe(sasslint.format())
  	.pipe(sasslint.failOnError())
};

// Error handler.
// -----------------------
function plumbError() {
  return plumber({
    errorHandler: function(err) {
      notify.onError({
        templateOptions: {
          date: new Date()
        },
        title: "Gulp error in " + err.plugin,
        message:  err.formatted
      })(err);
      this.emit('end');
    }
  })
}

// Gulp tasks
// -----------------------
const builtScript 	= gulp.series(buildScripts);
// const builtCss		= gulp.series(buildStyles, sassLinter);
const builtCss		= gulp.series(buildStyles);
const watching = gulp.parallel(watchFiles, browserSync);
const build 		= gulp.parallel(builtCss, builtScript, watching);
// const build 		= gulp.parallel(builtScript, watching);
// const build 		= gulp.parallel(builtCss, watching);

// Expose tasks
// -----------------------
exports.style 		= builtCss;		// $ gulp styles
exports.script 		= builtScript;	// $ gulp script
// exports.sassLint		= sassLinter;	// $ gulp sassLinter
exports.watch 		= watching; 	// $ gulp watch
exports.default 	= build;		// $ gulp