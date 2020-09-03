const gulp = require('gulp');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const rename = require("gulp-rename");
const header = require('gulp-header');
const jsdoc = require('gulp-jsdoc3');
const jeditor = require('gulp-json-editor');
const fs = require('fs-extra');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const babel = require("gulp-babel");
const eslint = require('gulp-eslint');
const buildConfig = require('./build.json');

gulp.task('doc', function (cb) {
    let config = require('./jsdoc.json');
    config.opts.destination = `./docs/${buildConfig.version}`;
    gulp.src(['docs/README.md', 'src/*.js'], { read: false })
        .pipe(jsdoc(config, cb));
});

gulp.task('es6', gulp.series(gulp.parallel(() => {
    return gulp.src("./build.json")
    .pipe(jeditor({
        'buildDate': new Date().toUTCString()
    }))
    .pipe(gulp.dest('dist'))
}, () => {
    return gulp.src('src/lib/resources.json')
      .pipe(gulp.dest('dist/lib'))
}),
() => {
    return gulp.src(['src/**/*.js', '!src/lib/JS-Interpreter/acorn_interpreter.js', '!src/lib/JS-Interpreter/demos/**/*'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        corejs: 3
                    }
                ]
            ],
            shouldPrintComment: (val) => /^\*/.test(val)
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
}));

gulp.task('build', () => {
    let license = fs.readFileSync('./LICENSE').toString();
    return browserify({
        entries: 'dist/app.js',
        debug: true
    })
        .require('./dist/openBSE.js', { expose: 'openbse' })
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

gulp.task('eslint', () => {
    return gulp.src(['src/*.js', 'src/*.ts'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

gulp.task('copy', () => {
    return gulp.src('src/openBSE.d.ts')
      .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.parallel(
    gulp.series('es6', 'build', 'min'), 
    gulp.series('doc'), 
    gulp.series('copy'))
);