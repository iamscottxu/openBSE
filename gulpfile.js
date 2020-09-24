const gulp = require('gulp');
const bro = require('gulp-bro');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const header = require('gulp-header');
const jsdoc = require('gulp-jsdoc3');
const jeditor = require('gulp-json-editor');
const fs = require('fs-extra');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");
const eslint = require('gulp-eslint');
const buildConfig = require('./build.json');
const packageConfig = require('./package.json');

gulp.task('doc', (cb) => {
    let config = require('./jsdoc.json');
    config.opts.destination = `./docs/${/^[0-9]*.[0-9]*/.exec(packageConfig.version)}`;
    gulp.src(['README.md', 'src/**/*.js', '!src/lib/**/*', '!src/renderers/**/*'], { read: false })
        .pipe(jsdoc(config, cb));
});

gulp.task('es6', gulp.series(gulp.parallel(() => {
    return gulp.src("./build.json")
    .pipe(jeditor({
        'buildDate': new Date().toUTCString(),
        'version': packageConfig.version
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

gulp.task('browserify', () => {
    let license = fs.readFileSync('./LICENSE').toString();
    return gulp.src('dist/app.js')
        .pipe(bro({
            debug: true,
            require: './openBSE.js'
        }))
        .pipe(rename(`${buildConfig.name}.all.js`))
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

gulp.task('build', gulp.parallel(
    gulp.series('es6', 'browserify', 'min'),
    gulp.series('copy'))
);

gulp.task('changename', () => {
    return gulp.src("./package.json")
    .pipe(jeditor({
        'name': "@iamscottxu/openbse"
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('default', gulp.parallel('build','doc'));