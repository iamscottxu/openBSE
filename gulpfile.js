const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const rename = require("gulp-rename");
const header = require('gulp-header');
const jsdoc = require('gulp-jsdoc3');
const fs = require('fs-extra');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const buildConfig = require('./build.json');

gulp.task('doc', function (cb) {
    let config = require('./jsdoc.json');
    config.opts.destination = `./docs/${buildConfig.version}`;
    gulp.src(['docs/README.md', 'src/*.js'], { read: false })
        .pipe(jsdoc(config, cb));
});

gulp.task('build', () => {
    buildConfig.buildDate = new Date().toUTCString();
    let license = fs.readFileSync('./LICENSE').toString();
    
    fs.writeJSONSync('src/build.json', buildConfig);

    return browserify({
        entries: 'src/app.js',
        debug: true
    })
        .require('./src/openBSE.js', {expose: 'openbse'})
        .transform(babelify, {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage'
                    }
                ]
            ],
            shouldPrintComment: (val) => /^\*/.test(val)
        })
        .bundle()
        .pipe(source(`${buildConfig.name}.all.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(header('/*!\n${license}\nHome: ${home}\n*/\n', { license: license, home: buildConfig.home }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
});

gulp.task('min', () => {
    return gulp.src(`dist/${buildConfig.name}.all.js`)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({
            compress: {
                passes: 10
            },
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('build', 'min', 'doc'));