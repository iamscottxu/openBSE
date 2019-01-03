const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const rename = require("gulp-rename");

gulp.task('build', () => {
    return browserify({
        entries: ['src/app.js', 'src/BulletScreenEngine.js']
    })
        .transform(babelify, {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source('BulletScreenEngine.all.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('min', () => {
    return gulp.src('dist/BulletScreenEngine.all.js')
        .pipe(uglify())
        .pipe(rename('BulletScreenEngine.all.min.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('build', 'min'));