const gulp = require('gulp');

gulp.task('watch', () => {
    gulp.watch('src/style.css', ['css']);
});

gulp.task('css', () => {
    return gulp.src('src/style.css')
        .pipe(gulp.dest('./public/'));
});

gulp.task('publicImages', () => {
    return gulp.src('src/*.jpeg')
        .pipe(gulp.dest('./public/'));
});