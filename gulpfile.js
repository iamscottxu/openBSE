const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const rename = require("gulp-rename");
const header = require('gulp-header');
const jsdoc = require('gulp-jsdoc3');
const fs = require('fs-extra');
const buildConfig = require('./build.json');

gulp.task('doc', function (cb) {
    let config = require('./jsdoc.json');
    config.opts.destination = `./docs/${buildConfig.version}`;
    gulp.src(['README.md', 'src/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('build', () => {
    let version = '';
    version += `const VERSION = '${buildConfig.version}';`;
    version += `const BUILE_DATE = '${new Date().toUTCString()}';`;
    version += 'export {VERSION, BUILE_DATE}';
    fs.writeFileSync('./src/version.js', version, { 'flag': 'w' });
    let license = fs.readFileSync('./LICENSE').toString();
    return browserify({
        entries: ['src/app.js', 'src/openBSE.js']
    })
        .transform(babelify, {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source(`${buildConfig.name}.all.js`))
        .pipe(header('/*!\n${license}\nHome: ${home}\n*/\n', { license: license, home: buildConfig.home }))
        .pipe(gulp.dest('dist'))
});

gulp.task('min', () => {
    return gulp.src(`dist/${buildConfig.name}.all.js`)
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('build', 'min', 'doc'));