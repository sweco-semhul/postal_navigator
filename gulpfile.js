var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var proxyMiddleware = require('http-proxy-middleware');

var proxies = [
  proxyMiddleware('/pgm', {target: 'http://ext-test.pgm.postnord.com', pathRewrite: { '^/pgm': '', ws: true }  }),
  proxyMiddleware('/osrm', {target: 'http://10.250.250.14:5000', pathRewrite: { '^/osrm': '', ws: true }  })

];

var config = {
  entryFile: './src/app.js',
  outputDir: './dist/',
  outputFile: 'app.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean'], function() {
  gulp.src('src/vendor/**').pipe(gulp.dest(config.outputDir+ '/vendor'))
  gulp.src('src/static/**').pipe(gulp.dest(config.outputDir+ '/static'))
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});
// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './',
      middleware: proxies
    }
  });
});

gulp.task('watch', ['build-persistent', 'serve'], function() {

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});
