const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const rename = require("gulp-rename");
const header = require('gulp-header');
const fs = require('fs');
const VERSION = '1.3'; //版本号

gulp.task('build', () => {
    let version = '';
    version += 'const VERSION = "' + VERSION + '";';
    version += 'const BUILE_DATE = "' + new Date().toUTCString() + '";';
    version += 'export {VERSION, BUILE_DATE}';
    fs.writeFileSync('./src/version.js', version, { 'flag': 'w' });
    let license = fs.readFileSync('./LICENSE').toString();
    let home = 'https://iamscottxu.github.io/BulletScreenEngine/';
    return browserify({
        entries: ['src/app.js', 'src/bulletScreenEngine.js']
    })
        .transform(babelify, {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source('bulletScreenEngine.all.js'))
        .pipe(header('/*!\n${license}\nHome: ${home}\n*/\n', {license: license, home: home}))
        .pipe(gulp.dest('dist'))
});

gulp.task('min', () => {
    return gulp.src('dist/bulletScreenEngine.all.js')
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('build', 'min'));