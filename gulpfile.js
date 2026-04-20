const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const uglify = require('gulp-uglify');
const webp = require('gulp-webp');
const webserver = require('gulp-webserver');
const { rimraf } = require('rimraf');

// Clean dist folder
gulp.task('clean', async function() {
  await rimraf('dist');
});

// Sass task
gulp.task('sass', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      api: 'modern',
      quietDeps: true,
      silenceDeprecations: ['legacy-js-api', 'import']
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

// JavaScript task (main.js - excludes i18n.js)
gulp.task('js', function() {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery.inputmask/dist/jquery.inputmask.bundle.js',
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/jquery-viewport-checker/src/jquery.viewportchecker.js',
      'src/libs/**/*.js',
      'src/js/**/*.js',
      '!src/js/i18n.js' // Exclude i18n.js from main bundle
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
});

// Copy i18n.js separately (must load before main.js)
gulp.task('js-i18n', function() {
  return gulp.src('src/js/i18n.js')
    .pipe(gulp.dest('dist/js'));
});

// Images task - converts PNG to WebP
gulp.task('images-png', function() {
  return gulp.src('src/images/**/*.png')
    .pipe(webp({ quality: 85 }))
    .pipe(gulp.dest('dist/images'));
});

// Converts JPG/JPEG to WebP
gulp.task('images-jpg', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg}')
    .pipe(webp({ quality: 85 }))
    .pipe(gulp.dest('dist/images'));
});

// Copies existing WebP files without conversion
gulp.task('images-webp', function() {
  return gulp.src('src/images/**/*.webp')
    .pipe(gulp.dest('dist/images'));
});

// Copies SVG files as-is (no conversion)
gulp.task('images-svg', function() {
  return gulp.src('src/images/**/*.svg')
    .pipe(gulp.dest('dist/images'));
});

// Optimize raster images (PNG, JPG, JPEG) - original formats
gulp.task('images-optimize', function() {
  return gulp.src('src/images/**/*.{png,jpg,jpeg}')
    .pipe(imagemin([
      imageminMozjpeg({ quality: 85, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest('dist/images'));
});

// Converts all raster image formats (PNG, JPG, JPEG) to WebP
gulp.task('images-all', gulp.parallel('images-png', 'images-jpg', 'images-webp', 'images-svg'));

// Fonts task
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

// Locales task (copy translation files)
gulp.task('locales', function() {
  return gulp.src('src/locales/**/*.json')
    .pipe(gulp.dest('dist/locales'));
});

// HTML pages task
gulp.task('pages', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

// PHP files task
gulp.task('php', function() {
  return gulp.src('src/**/*.php')
    .pipe(gulp.dest('dist'));
});

// Copy PHPMailer vendor to dist
gulp.task('vendor', function() {
  return gulp.src('vendor/**/*', { base: '.' })
    .pipe(gulp.dest('dist'));
});

// Copy favicon folder with all files
gulp.task('favicon', function() {
  return gulp.src('src/favicon/**/*', { 
      base: 'src' // Preserve folder structure
    })
    .pipe(gulp.dest('dist'));
});

// Serve task
gulp.task('serve', function() {
  return gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true,
      fallback: 'index.html',
      port: 3000
    }));
});

// Build task
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('sass', 'js', 'js-i18n', 'images-all', 'images-optimize', 'fonts', 'locales', 'pages', 'php', 'favicon', 'vendor')
));

// Watch task
gulp.task('watch', function() {
  gulp.watch('src/**/*.html', gulp.series('pages'));
  gulp.watch('src/**/*.php', gulp.series('php'));
  gulp.watch(['src/js/**/*.js', '!src/js/i18n.js'], gulp.series('js'));
  gulp.watch('src/js/i18n.js', gulp.series('js-i18n'));
  gulp.watch('src/libs/**/*.js', gulp.series('js'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/images/**/*.{png,jpg,jpeg}', gulp.series('images-all', 'images-optimize'));
  gulp.watch('src/images/**/*.webp', gulp.series('images-webp'));
  gulp.watch('src/images/**/*.svg', gulp.series('images-svg'));
  gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
  gulp.watch('src/locales/**/*.json', gulp.series('locales'));
});

// Default task
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
