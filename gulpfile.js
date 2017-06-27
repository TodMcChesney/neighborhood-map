/* jshint node: true, esversion: 6 */
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const rm = require('gulp-rm');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const processhtml = require('gulp-processhtml');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const jsonMinify = require('gulp-json-minify');


// Running dev tasks from the CLI:
// $ gulp (Runs browserSync and watches for changes)

// browserSync
gulp.task('browserSync', () =>
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
);

// Default gulp task runs browserSync and watches for changes
gulp.task('default', ['browserSync'], () => {
    gulp.watch('src/css/styles.css', browserSync.reload);
    gulp.watch('src/img/*.+(png|jpg|svg)', browserSync.reload);
    gulp.watch('src/js/*.js', browserSync.reload);
    gulp.watch('src/js/*.json', browserSync.reload);
    gulp.watch('src/index.html', browserSync.reload);
});

// Run build task from the CLI:
// $ gulp build (Runs all production tasks in sequence to build dist folder)

// clean:dist
gulp.task('clean:dist', () =>
    gulp.src('dist/**/*', {
        read: false
    })
    .pipe(rm())
);

// minify:js
gulp.task('minify:js', ['clean:dist'], () =>
    gulp.src(['src/js/knockout-3.4.2.js', 'src/js/jquery-3.2.1.min.js', 'src/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
);

// minify:json
gulp.task('minify:json', ['clean:dist'], () =>
    gulp.src('src/js/*.json')
    .pipe(jsonMinify())
    .pipe(gulp.dest('dist/js'))
    .on('error', util.log)
);

// minify:css
gulp.task('minify:css', ['clean:dist'], () =>
    gulp.src('src/css/styles.css')
    .pipe(cssnano())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
);

// minify:html
gulp.task('minify:html', ['clean:dist'], () =>
    gulp.src('src/*.html')
    .pipe(processhtml())
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
);

// copy
gulp.task('copy', ['clean:dist'], () =>
    gulp.src(['src/img/**/*.+(png|jpg|svg)', 'src/*.!(html)'], {
        base: 'src'
    })
    .pipe(gulp.dest('dist'))
);

// build
gulp.task('build', ['clean:dist', 'minify:js', 'minify:json', 'minify:css', 'minify:html', 'copy']);
