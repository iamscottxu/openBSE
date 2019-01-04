const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const rename = require("gulp-rename");
const fs = require('fs');
const VERSION = '1.1'; //版本号

gulp.task('build', () => {
    let version = '';
    version += 'const VERSION = "' + VERSION + '";';
    version += 'const BUILE_DATE = "' + new Date().toUTCString() + '";';
    version += 'export {VERSION, BUILE_DATE}';
    fs.writeFileSync('./src/version.js', version, { 'flag': 'w' });
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