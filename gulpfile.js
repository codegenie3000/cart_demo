const gulp = require('gulp');

gulp.task('copyToPublic', ['css', 'publicImages'], () => {
   // nothing here
});

gulp.task('css', () => {
    return gulp.src('src/style.css')
        .pipe(gulp.dest('./public/'));
});

gulp.task('publicImages', () => {
    return gulp.src('src/*.jpeg')
        .pipe(gulp.dest('./public/'));
});