/* jshint node: true, esversion: 6 */
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');

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
    gulp.watch('src/index.html', browserSync.reload);
});
